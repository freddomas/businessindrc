"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
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
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
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

  const statusBreakdown = useMemo(
    () => statuses.map((item) => ({ name: item, count: partners.filter((partner) => partner.status === item).length })),
    [partners]
  );

  const sectorBreakdown = useMemo(
    () =>
      sectors
        .map((item) => ({ name: item, count: partners.filter((partner) => partner.sector === item).length }))
        .filter((item) => item.count > 0),
    [partners, sectors]
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

  function openPartner(partner: Partner) {
    setSelectedPartner(partner);
  }

  function openPartnerFromKeyboard(event: KeyboardEvent<HTMLTableRowElement>, partner: Partner) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPartner(partner);
    }
  }

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
    if (selectedPartner?.id === id) {
      setSelectedPartner(null);
    }
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
          <a href="#secteurs">Couverture</a>
        </nav>
        <div className="session-box">
          <span>{user.organization}</span>
          <small>Rôle: {user.role}</small>
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

        <section id="qualification" className="qualification-panel" aria-labelledby="qualification-title">
          <div className="console-section-heading">
            <p className="eyebrow">Qualification</p>
            <h2 id="qualification-title">Statut d’abord, indice en appui.</h2>
          </div>

          <div className="console-metrics" aria-label="Indicateurs console">
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
              <span>Indice moyen</span>
            </div>
            <div>
              <Filter aria-hidden="true" size={20} />
              <strong>{stats.cities}</strong>
              <span>Villes</span>
            </div>
          </div>

          <div className="qualification-board">
            <section className="score-method-panel" aria-labelledby="score-method-title">
              <div>
                <p className="eyebrow">Méthode de lecture</p>
                <h2 id="score-method-title">Indice 0-100</h2>
              </div>
              <div className="score-method-copy">
                <p>
                  Le statut porte la décision métier. L&apos;indice sert à prioriser deux partenaires de statut comparable.
                  Base utilisée: documents 20, références 20, capacité 20, couverture 15, risque 15, fraîcheur de
                  l&apos;évaluation 10.
                </p>
                <div className="score-method-points" aria-label="Critères de l'indice">
                  <span>Documents 20</span>
                  <span>Références 20</span>
                  <span>Capacité 20</span>
                  <span>Couverture 15</span>
                  <span>Risque 15</span>
                  <span>Fraîcheur 10</span>
                </div>
              </div>
            </section>

            <section className="status-breakdown" aria-labelledby="status-breakdown-title">
              <div>
                <p className="eyebrow">Décision</p>
                <h2 id="status-breakdown-title">Répartition par statut</h2>
              </div>
              <div className="status-list">
                {statusBreakdown.map((item) => (
                  <span key={item.name}>
                    <strong>{item.count}</strong>
                    {item.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section id="registre" className="registry-panel">
          <div className="registry-heading">
            <div>
              <p className="eyebrow">Registre</p>
              <h2>Partenaires contrôlés</h2>
            </div>
            <p>Fiches complètes, statut, risque, indice et dernière évaluation dans une seule vue de travail.</p>
          </div>

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
                  <th>Indice</th>
                  <th>Évaluation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((partner) => (
                  <tr
                    className="partner-row"
                    key={partner.id}
                    tabIndex={0}
                    aria-label={`Fiche ${partner.companyName}`}
                    onClick={() => openPartner(partner)}
                    onKeyDown={(event) => openPartnerFromKeyboard(event, partner)}
                  >
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
                    <td data-label="Indice">
                      <span className="score-chip">{partner.readinessScore}%</span>
                    </td>
                    <td data-label="Évaluation">
                      <time dateTime={partner.lastAssessment}>{formatAssessmentDate(partner.lastAssessment)}</time>
                    </td>
                    <td data-label="Actions">
                      <div className="row-actions">
                        <button
                          type="button"
                          aria-label={`Modifier ${partner.companyName}`}
                          disabled={!ready}
                          onKeyDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedPartner(null);
                            setDraft(toDraft(partner));
                          }}
                        >
                          <Edit3 aria-hidden="true" size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Supprimer ${partner.companyName}`}
                          disabled={!ready}
                          onKeyDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation();
                            removePartner(partner.id);
                          }}
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

          <section id="secteurs" className="sector-panel" aria-labelledby="sector-panel-title">
            <div className="console-section-heading compact">
              <p className="eyebrow">Couverture</p>
              <h2 id="sector-panel-title">Secteurs et villes du registre</h2>
            </div>
            <div className="sector-summary" aria-label="Répartition par secteur">
              {sectorBreakdown.map((item) => (
                <span key={item.name}>
                  <strong>{item.count}</strong>
                  {item.name}
                </span>
              ))}
            </div>
            <div className="city-summary" aria-label="Villes couvertes">
              {cities.map((city) => (
                <span key={city}>{city}</span>
              ))}
            </div>
          </section>
        </section>
      </section>

      {selectedPartner ? (
        <div className="modal-backdrop" role="presentation">
          <section className="partner-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="partner-detail-title">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">Fiche partenaire</p>
                <h2 id="partner-detail-title">{selectedPartner.companyName}</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Fermer" onClick={() => setSelectedPartner(null)}>
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            <div className="partner-detail-body">
              <div className="partner-detail-grid">
                <article>
                  <span>Statut</span>
                  <strong>{selectedPartner.status}</strong>
                </article>
                <article>
                  <span>Risque</span>
                  <strong>{selectedPartner.riskLevel}</strong>
                </article>
                <article>
                  <span>Indice</span>
                  <strong>{selectedPartner.readinessScore}%</strong>
                </article>
                <article>
                  <span>Évaluation</span>
                  <strong>{formatAssessmentDate(selectedPartner.lastAssessment)}</strong>
                </article>
              </div>

              <div className="detail-columns">
                <section>
                  <h3>Contact</h3>
                  <dl className="detail-list">
                    <div>
                      <dt>Responsable</dt>
                      <dd>{selectedPartner.contactName}</dd>
                    </div>
                    <div>
                      <dt>Fonction</dt>
                      <dd>{selectedPartner.contactTitle}</dd>
                    </div>
                    <div>
                      <dt>Téléphone</dt>
                      <dd>{selectedPartner.phone}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{selectedPartner.email}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h3>Capacité</h3>
                  <dl className="detail-list">
                    <div>
                      <dt>Secteur</dt>
                      <dd>{selectedPartner.sector}</dd>
                    </div>
                    <div>
                      <dt>Ville</dt>
                      <dd>
                        {selectedPartner.city}, {selectedPartner.province}
                      </dd>
                    </div>
                    <div>
                      <dt>Effectif</dt>
                      <dd>{selectedPartner.workforce}</dd>
                    </div>
                    <div>
                      <dt>Capacité annuelle</dt>
                      <dd>{selectedPartner.annualCapacity}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <section className="detail-block">
                <h3>Zones, services et certifications</h3>
                <div className="detail-tags">
                  {selectedPartner.zoneCoverage.map((item) => (
                    <span key={`zone-${item}`}>{item}</span>
                  ))}
                  {selectedPartner.services.map((item) => (
                    <span key={`service-${item}`}>{item}</span>
                  ))}
                  {selectedPartner.certifications.map((item) => (
                    <span key={`certification-${item}`}>{item}</span>
                  ))}
                </div>
              </section>

              <section className="detail-block">
                <h3>Notes d&apos;évaluation</h3>
                <p>{selectedPartner.notes}</p>
              </section>

              <div className="detail-actions">
                <button className="secondary-action" type="button" onClick={() => setSelectedPartner(null)}>
                  Fermer
                </button>
                <button
                  className="primary-action"
                  type="button"
                  disabled={!ready}
                  onClick={() => {
                    setDraft(toDraft(selectedPartner));
                    setSelectedPartner(null);
                  }}
                >
                  <Edit3 aria-hidden="true" size={18} />
                  Modifier la fiche
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

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
                Indice
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
