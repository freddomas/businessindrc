"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Check,
  Edit3,
  Filter,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import type { DashboardStats, Partner, PartnerInput, PartnerStatus, RiskLevel, SessionUser } from "../lib/types";
import { LogoutButton } from "./LogoutButton";

type Props = {
  initialPartners: Partner[];
  initialStats: DashboardStats;
  sectors: string[];
  user: SessionUser;
};

type Draft = {
  id?: string;
  companyName: string;
  sector: string;
  city: string;
  province: "Lualaba" | "Haut-Katanga";
  contactName: string;
  contactTitle: string;
  phone: string;
  email: string;
  status: PartnerStatus;
  riskLevel: RiskLevel;
  readinessScore: number;
  workforce: number;
  annualCapacity: string;
  zoneCoverage: string;
  services: string;
  certifications: string;
  lastAssessment: string;
  notes: string;
};

const blankDraft: Draft = {
  companyName: "",
  sector: "Mines",
  city: "Kolwezi",
  province: "Lualaba",
  contactName: "",
  contactTitle: "",
  phone: "",
  email: "",
  status: "En analyse",
  riskLevel: "Modéré",
  readinessScore: 70,
  workforce: 12,
  annualCapacity: "",
  zoneCoverage: "Kolwezi",
  services: "",
  certifications: "",
  lastAssessment: new Date().toISOString().slice(0, 10),
  notes: ""
};

const statuses: PartnerStatus[] = ["Qualifié", "En analyse", "Sous réserve", "Suspendu"];
const riskLevels: RiskLevel[] = ["Bas", "Modéré", "Élevé"];

function toDraft(partner: Partner): Draft {
  return {
    ...partner,
    zoneCoverage: partner.zoneCoverage.join(", "),
    services: partner.services.join(", "),
    certifications: partner.certifications.join(", ")
  };
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatAssessmentDate(value: string): string {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function toInput(draft: Draft): PartnerInput {
  return {
    id: draft.id,
    companyName: draft.companyName.trim(),
    sector: draft.sector,
    city: draft.city.trim(),
    province: draft.province,
    contactName: draft.contactName.trim(),
    contactTitle: draft.contactTitle.trim(),
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    status: draft.status,
    riskLevel: draft.riskLevel,
    readinessScore: Number(draft.readinessScore),
    workforce: Number(draft.workforce),
    annualCapacity: draft.annualCapacity.trim(),
    zoneCoverage: splitList(draft.zoneCoverage),
    services: splitList(draft.services),
    certifications: splitList(draft.certifications),
    lastAssessment: draft.lastAssessment,
    notes: draft.notes.trim()
  };
}

function computeStats(partners: Partner[]): DashboardStats {
  const total = partners.length;
  const qualified = partners.filter((partner) => partner.status === "Qualifié").length;
  const underReview = partners.filter((partner) => partner.status === "En analyse").length;
  const averageReadiness = total
    ? Math.round(partners.reduce((sum, partner) => sum + partner.readinessScore, 0) / total)
    : 0;

  return {
    total,
    qualified,
    underReview,
    averageReadiness,
    sectors: new Set(partners.map((partner) => partner.sector)).size,
    cities: new Set(partners.map((partner) => partner.city)).size
  };
}

export function AdminConsole({ initialPartners, initialStats, sectors, user }: Props) {
  const [partners, setPartners] = useState(initialPartners);
  const [stats, setStats] = useState(initialStats);
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const cities = useMemo(
    () => Array.from(new Set(partners.map((partner) => partner.city))).sort((a, b) => a.localeCompare(b)),
    [partners]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return partners
      .filter((partner) => !sector || partner.sector === sector)
      .filter((partner) => !status || partner.status === status)
      .filter((partner) => {
        if (!normalizedQuery) return true;
        return [
          partner.companyName,
          partner.city,
          partner.sector,
          partner.contactName,
          partner.services.join(" "),
          partner.zoneCoverage.join(" ")
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => b.readinessScore - a.readinessScore || a.companyName.localeCompare(b.companyName));
  }, [partners, query, sector, status]);

  function updateDraft(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setDraft((current) => (current ? { ...current, [name]: value } : current));
  }

  function refreshStats(nextPartners: Partner[]) {
    setStats(computeStats(nextPartners));
  }

  async function savePartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving) return;

    setSaving(true);
    setMessage("");
    const payload = toInput(draft);
    const endpoint = draft.id ? `/api/partners/${draft.id}` : "/api/partners";
    const method = draft.id ? "PATCH" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setSaving(false);
      setMessage("Enregistrement refusé. Vérifiez les champs obligatoires.");
      return;
    }

    const data = (await response.json()) as { partner: Partner };
    const nextPartners = draft.id
      ? partners.map((partner) => (partner.id === data.partner.id ? data.partner : partner))
      : [data.partner, ...partners];

    setPartners(nextPartners);
    refreshStats(nextPartners);
    setDraft(null);
    setSaving(false);
    setMessage("Registre mis à jour.");
  }

  async function removePartner(id: string) {
    if (saving) return;

    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/partners/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setSaving(false);
      setMessage("Suppression refusée.");
      return;
    }

    const nextPartners = partners.filter((partner) => partner.id !== id);
    setPartners(nextPartners);
    refreshStats(nextPartners);
    setSaving(false);
    setMessage("Partenaire retiré du registre.");
  }

  return (
    <div className="console-shell" data-console-ready={ready ? "true" : "false"}>
      <aside className="console-sidebar">
        <Link href="/" className="console-brand" aria-label="OCTOPUS Mining">
          <Image src="/media/octopus-logo.png" alt="Logo OCTOPUS Mining" width={188} height={58} priority unoptimized />
        </Link>
        <nav aria-label="Navigation console">
          <a className="active" href="#registre">
            Registre
          </a>
          <a href="#qualification">Qualification</a>
          <a href="#secteurs">Secteurs</a>
        </nav>
        <div className="session-box">
          <span>{user.name}</span>
          <small>{user.role}</small>
          <LogoutButton />
        </div>
      </aside>

      <section className="console-main" aria-labelledby="console-title">
        <header className="console-topbar">
          <div>
            <p className="eyebrow">Pilotage privé</p>
            <h1 id="console-title">Registre partenaires</h1>
          </div>
          <button className="primary-action" type="button" disabled={!ready} onClick={() => setDraft(blankDraft)}>
            <Plus aria-hidden="true" size={18} />
            Ajouter partenaire
          </button>
        </header>

        <section id="qualification" className="console-metrics" aria-label="Indicateurs console">
          <div>
            <Activity aria-hidden="true" size={20} />
            <strong>{stats.total}</strong>
            <span>Total</span>
          </div>
          <div>
            <Check aria-hidden="true" size={20} />
            <strong>{stats.qualified}</strong>
            <span>Qualifiés</span>
          </div>
          <div>
            <ShieldCheck aria-hidden="true" size={20} />
            <strong>{stats.averageReadiness}%</strong>
            <span>Score moyen</span>
          </div>
          <div>
            <Filter aria-hidden="true" size={20} />
            <strong>{stats.cities}</strong>
            <span>Villes</span>
          </div>
        </section>

        <section className="score-method-panel" aria-labelledby="score-method-title">
          <div>
            <p className="eyebrow">Méthode de lecture</p>
            <h2 id="score-method-title">Méthode du score</h2>
          </div>
          <div className="score-method-copy">
            <p>
              Score 0-100: indice interne renseigné par l&apos;équipe après revue des documents, références, capacité
              déclarée, couverture de zone, niveau de risque et fraîcheur de l&apos;évaluation. Il oriente la revue; la
              décision finale reste une qualification terrain.
            </p>
            <div className="score-method-points" aria-label="Critères du score">
              <span>Documents</span>
              <span>Références</span>
              <span>Capacité</span>
              <span>Couverture</span>
              <span>Risque</span>
              <span>Fraîcheur</span>
            </div>
          </div>
        </section>

        <section id="registre" className="registry-panel">
          <div className="registry-toolbar">
            <label className="search-field">
              <Search aria-hidden="true" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                aria-label="Recherche partenaires"
              />
            </label>
            <select aria-label="Filtrer par secteur" value={sector} onChange={(event) => setSector(event.target.value)}>
              <option value="">Tous les secteurs</option>
              {sectors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select aria-label="Filtrer par statut" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">Tous les statuts</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {message ? (
            <p className="console-message" role="status">
              {message}
            </p>
          ) : null}

          <div className="partners-table-wrap" data-allow-horizontal-scroll="true">
            <table className="partners-table">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Secteur</th>
                  <th>Ville</th>
                  <th>Statut</th>
                  <th>Risque</th>
                  <th>Score</th>
                  <th>Évaluation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((partner) => (
                  <tr key={partner.id}>
                    <td data-label="Entreprise">
                      <strong>{partner.companyName}</strong>
                      <span>{partner.contactName}</span>
                    </td>
                    <td data-label="Secteur">{partner.sector}</td>
                    <td data-label="Ville">{partner.city}</td>
                    <td data-label="Statut">
                      <span className={`status-pill status-${partner.status.replace(/\s/g, "-").toLowerCase()}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td data-label="Risque">{partner.riskLevel}</td>
                    <td data-label="Score">{partner.readinessScore}%</td>
                    <td data-label="Évaluation">
                      <time dateTime={partner.lastAssessment}>{formatAssessmentDate(partner.lastAssessment)}</time>
                    </td>
                    <td data-label="Actions">
                      <div className="row-actions">
                        <button
                          type="button"
                          aria-label={`Modifier ${partner.companyName}`}
                          disabled={!ready}
                          onClick={() => setDraft(toDraft(partner))}
                        >
                          <Edit3 aria-hidden="true" size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Supprimer ${partner.companyName}`}
                          disabled={!ready}
                          onClick={() => removePartner(partner.id)}
                        >
                          <Trash2 aria-hidden="true" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div id="secteurs" className="sector-summary">
            {cities.map((city) => (
              <span key={city}>{city}</span>
            ))}
          </div>
        </section>
      </section>

      {draft ? (
        <div className="modal-backdrop" role="presentation">
          <section className="partner-modal" role="dialog" aria-modal="true" aria-labelledby="partner-form-title">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">Fiche partenaire</p>
                <h2 id="partner-form-title">{draft.id ? "Modifier le dossier" : "Ajouter un dossier"}</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Fermer" onClick={() => setDraft(null)}>
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <form className="partner-form" onSubmit={savePartner}>
              <label>
                Entreprise
                <input name="companyName" value={draft.companyName} onChange={updateDraft} required minLength={3} />
              </label>
              <label>
                Secteur
                <select name="sector" value={draft.sector} onChange={updateDraft}>
                  {sectors.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ville
                <input name="city" value={draft.city} onChange={updateDraft} required minLength={2} />
              </label>
              <label>
                Province
                <select name="province" value={draft.province} onChange={updateDraft}>
                  <option value="Lualaba">Lualaba</option>
                  <option value="Haut-Katanga">Haut-Katanga</option>
                </select>
              </label>
              <label>
                Contact
                <input name="contactName" value={draft.contactName} onChange={updateDraft} required minLength={3} />
              </label>
              <label>
                Fonction
                <input name="contactTitle" value={draft.contactTitle} onChange={updateDraft} required minLength={3} />
              </label>
              <label>
                Téléphone
                <input name="phone" value={draft.phone} onChange={updateDraft} required minLength={8} />
              </label>
              <label>
                Email
                <input name="email" type="email" value={draft.email} onChange={updateDraft} required />
              </label>
              <label>
                Statut
                <select name="status" value={draft.status} onChange={updateDraft}>
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Risque
                <select name="riskLevel" value={draft.riskLevel} onChange={updateDraft}>
                  {riskLevels.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Score
                <input
                  name="readinessScore"
                  type="number"
                  min={0}
                  max={100}
                  value={draft.readinessScore}
                  onChange={updateDraft}
                  required
                />
              </label>
              <label>
                Effectif
                <input name="workforce" type="number" min={1} value={draft.workforce} onChange={updateDraft} required />
              </label>
              <label className="wide-field">
                Capacité annuelle
                <input name="annualCapacity" value={draft.annualCapacity} onChange={updateDraft} required minLength={6} />
              </label>
              <label>
                Zones couvertes
                <input name="zoneCoverage" value={draft.zoneCoverage} onChange={updateDraft} required minLength={2} />
              </label>
              <label>
                Services
                <input name="services" value={draft.services} onChange={updateDraft} required minLength={2} />
              </label>
              <label>
                Certifications
                <input name="certifications" value={draft.certifications} onChange={updateDraft} />
              </label>
              <label>
                Dernière évaluation
                <input name="lastAssessment" type="date" value={draft.lastAssessment} onChange={updateDraft} required />
              </label>
              <label className="wide-field">
                Notes
                <textarea name="notes" value={draft.notes} onChange={updateDraft} required minLength={8} rows={4} />
              </label>
              <div className="modal-actions">
                <button className="secondary-action" type="button" onClick={() => setDraft(null)}>
                  Annuler
                </button>
                <button className="primary-action" type="submit" disabled={saving}>
                  <Save aria-hidden="true" size={18} />
                  {saving ? "Enregistrement" : "Enregistrer"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
