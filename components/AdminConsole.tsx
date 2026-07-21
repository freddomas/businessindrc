"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Check,
  ClipboardCheck,
  Edit3,
  Filter,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import { getBriefMatchCount, getBriefMatches, sourcingBriefs } from "../lib/console-model";
import type { DashboardStats, Partner, PartnerInput, PartnerStatus, RiskLevel, SessionUser } from "../lib/types";
import { LogoutButton } from "./LogoutButton";
import { BrandLockup } from "./BrandLockup";

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

const statuses: PartnerStatus[] = ["Qualifié", "En analyse", "Sous réserve", "Suspendu"];
const riskLevels: RiskLevel[] = ["Bas", "Modéré", "Élevé"];
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

function createBlankDraft(sector = "Mines"): Draft {
  return {
    companyName: "",
    sector,
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
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDraft(partner: Partner): Draft {
  return {
    ...partner,
    zoneCoverage: partner.zoneCoverage.join(", "),
    services: partner.services.join(", "),
    certifications: partner.certifications.join(", ")
  };
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

function formatAssessmentDate(value: string): string {
  return new Intl.DateTimeFormat("fr-CD", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function pluralizePartner(count: number): string {
  return count > 1 ? "partenaires" : "partenaire";
}

function urgencyClassName(urgency: string): string {
  if (urgency === "Critique") {
    return "urgency-critique";
  }

  if (urgency === "Prioritaire") {
    return "urgency-prioritaire";
  }

  return "urgency-planifie";
}

export function AdminConsole({ initialPartners, initialStats, sectors, user }: Props) {
  const [partners, setPartners] = useState(initialPartners);
  const [stats, setStats] = useState(initialStats);
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [activeBriefId, setActiveBriefId] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "danger">("success");
  const [ready, setReady] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const focusBeforeModalRef = useRef<HTMLElement | null>(null);
  const savingRef = useRef(saving);
  const modalOpen = Boolean(selectedPartner || draft);
  const modalKey = selectedPartner ? `detail:${selectedPartner.id}` : draft ? `form:${draft.id ?? "new"}` : "";

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  useEffect(() => {
    if (!modalOpen) return;

    focusBeforeModalRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      const previousFocus = focusBeforeModalRef.current;
      focusBeforeModalRef.current = null;
      if (previousFocus?.isConnected) {
        requestAnimationFrame(() => previousFocus.focus({ preventScroll: true }));
      }
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalKey) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    function getFocusableElements() {
      return Array.from(dialog!.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => element.getClientRects().length > 0
      );
    }

    function focusFirstElement() {
      const preferred = dialog!.querySelector<HTMLElement>("[data-modal-initial-focus]");
      (preferred ?? getFocusableElements()[0] ?? dialog!).focus({ preventScroll: true });
    }

    function closeActiveModal() {
      if (savingRef.current) return;
      setDraft(null);
      setSelectedPartner(null);
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeActiveModal();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        dialog!.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function keepFocusInside(event: FocusEvent) {
      if (event.target instanceof Node && !dialog!.contains(event.target)) {
        focusFirstElement();
      }
    }

    const frame = requestAnimationFrame(focusFirstElement);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", keepFocusInside);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
    };
  }, [modalKey]);

  const activeBrief = useMemo(
    () => sourcingBriefs.find((brief) => brief.id === activeBriefId) ?? null,
    [activeBriefId]
  );

  const activeBriefPartnerIds = useMemo(() => {
    if (!activeBrief) {
      return null;
    }

    return new Set(getBriefMatches(activeBrief, partners).map((partner) => partner.id));
  }, [activeBrief, partners]);

  const briefSummaries = useMemo(
    () =>
      sourcingBriefs.map((brief) => ({
        ...brief,
        matches: getBriefMatchCount(brief, partners)
      })),
    [partners]
  );

  const cities = useMemo(
    () => Array.from(new Set(partners.map((partner) => partner.city))).sort((a, b) => a.localeCompare(b)),
    [partners]
  );

  const statusBreakdown = useMemo(
    () =>
      statuses.map((item) => ({
        name: item,
        count: partners.filter((partner) => partner.status === item).length
      })),
    [partners]
  );

  const sectorBreakdown = useMemo(
    () =>
      sectors
        .map((item) => ({
          name: item,
          count: partners.filter((partner) => partner.sector === item).length
        }))
        .filter((item) => item.count > 0),
    [partners, sectors]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return partners
      .filter((partner) => !activeBriefPartnerIds || activeBriefPartnerIds.has(partner.id))
      .filter((partner) => !sector || partner.sector === sector)
      .filter((partner) => !status || partner.status === status)
      .filter((partner) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          partner.companyName,
          partner.city,
          partner.sector,
          partner.contactName,
          partner.status,
          partner.riskLevel,
          partner.services.join(" "),
          partner.zoneCoverage.join(" ")
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => b.readinessScore - a.readinessScore || a.companyName.localeCompare(b.companyName));
  }, [activeBriefPartnerIds, partners, query, sector, status]);

  function openPartner(partner: Partner) {
    setSelectedPartner(partner);
  }

  function updateDraft(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setDraft((current) => (current ? { ...current, [name]: value } : current));
  }

  function replacePartners(nextPartners: Partner[]) {
    setPartners(nextPartners);
    setStats(computeStats(nextPartners));
  }

  function showMessage(text: string, tone: "success" | "danger" = "success") {
    setMessage(text);
    setMessageTone(tone);
  }

  function clearFilters() {
    setQuery("");
    setSector("");
    setStatus("");
    setActiveBriefId("");
    setPendingDeleteId(null);
    setMessage("");
  }

  function applyBrief(briefId: string) {
    setActiveBriefId((current) => (current === briefId ? "" : briefId));
    setQuery("");
    setSector("");
    setStatus("");
    setPendingDeleteId(null);
    setMessage("");
  }

  async function savePartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft || saving) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = toInput(draft);
      const endpoint = draft.id ? `/api/partners/${draft.id}` : "/api/partners";
      const method = draft.id ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        showMessage("Enregistrement refusé. Vérifiez les champs obligatoires.", "danger");
        return;
      }

      const data = (await response.json()) as { partner: Partner };
      const nextPartners = draft.id
        ? partners.map((partner) => (partner.id === data.partner.id ? data.partner : partner))
        : [data.partner, ...partners];

      replacePartners(nextPartners);
      setDraft(null);
      setSelectedPartner(null);
      showMessage(draft.id ? "Dossier partenaire mis à jour." : "Dossier partenaire ajouté.");
    } catch {
      showMessage("Connexion interrompue. Réessayez l'enregistrement.", "danger");
    } finally {
      setSaving(false);
    }
  }

  async function removePartner(id: string) {
    if (saving) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/partners/${id}`, { method: "DELETE" });

      if (!response.ok) {
        showMessage("Suppression refusée. Le dossier est peut-être déjà verrouillé.", "danger");
        return;
      }

      const nextPartners = partners.filter((partner) => partner.id !== id);
      replacePartners(nextPartners);
      setPendingDeleteId(null);
      setSelectedPartner(null);
      showMessage("Dossier partenaire retiré du registre.");
    } catch {
      showMessage("Connexion interrompue. Réessayez la suppression.", "danger");
    } finally {
      setSaving(false);
    }
  }

  function beginDelete(id: string) {
    setPendingDeleteId(id);
    showMessage("Confirmez le retrait du dossier sélectionné.", "danger");
  }

  return (
    <div className="console-shell" data-console-ready={ready ? "true" : "false"}>
      <aside className="console-sidebar" aria-label="Navigation console">
        <BrandLockup className="console-brand" priority />

        <div className="session-box">
          <span>Session privée</span>
          <strong>{user.name}</strong>
          <small>
            {user.role} · {user.organization}
          </small>
        </div>

        <nav aria-label="Sections de la console">
          <a href="#flux-rfq">Flux RFQ</a>
          <a href="#qualification">Qualification</a>
          <a href="#registre">Registre</a>
          <a href="#secteurs">Couverture</a>
        </nav>

        <LogoutButton />
      </aside>

      <section className="console-main">
        <header className="console-topbar">
          <div>
            <p className="eyebrow">Console opérationnelle</p>
            <h1>Registre partenaires</h1>
            <p>
              Qualification, flux RFQ, couverture, statut, risque et capacité de mobilisation dans une même interface de
              travail.
            </p>
          </div>
          <button className="primary-action" type="button" onClick={() => setDraft(createBlankDraft(sectors[0]))} disabled={!ready}>
            <Plus aria-hidden="true" size={18} />
            Ajouter partenaire
          </button>
        </header>

        <section className="console-metrics" aria-label="Indicateurs console">
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
        </section>

        <section id="flux-rfq" className="sourcing-panel" aria-labelledby="sourcing-title">
          <div className="console-section-heading">
            <div>
              <p className="eyebrow">Flux RFQ</p>
              <h2 id="sourcing-title">Priorités de sourcing</h2>
            </div>
            <p>
              Chaque flux relie un besoin industriel à un bassin de partenaires non suspendus, par secteur et couverture
              terrain.
            </p>
          </div>

          <div className="sourcing-grid">
            {briefSummaries.map((brief) => {
              const isActive = activeBriefId === brief.id;
              return (
                <button
                  className={`sourcing-card${isActive ? " is-active" : ""}`}
                  type="button"
                  key={brief.id}
                  aria-pressed={isActive}
                  onClick={() => applyBrief(brief.id)}
                >
                  <span className={`urgency-pill ${urgencyClassName(brief.urgency)}`}>{brief.urgency}</span>
                  <strong>{brief.title}</strong>
                  <span className="brief-target">{brief.target}</span>
                  <span className="brief-meta">
                    <MapPin aria-hidden="true" size={15} />
                    {brief.corridor}
                  </span>
                  <span className="brief-count">
                    <ClipboardCheck aria-hidden="true" size={16} />
                    {brief.matches} {pluralizePartner(brief.matches)} mobilisable{brief.matches > 1 ? "s" : ""}
                  </span>
                  <span className="brief-action">{brief.nextAction}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section id="qualification" className="qualification-board">
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
              <span>Recherche</span>
              <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} aria-label="Recherche partenaires" />
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
            <button className="ghost-button reset-filters" type="button" onClick={clearFilters}>
              <RotateCcw aria-hidden="true" size={16} />
              Réinitialiser
            </button>
          </div>

          <div className="registry-filter-status" role="status">
            <strong>{filtered.length}</strong> dossier{filtered.length > 1 ? "s" : ""} affiché
            {filtered.length > 1 ? "s" : ""}
            {activeBrief ? <span>Shortlist: {activeBrief.title}</span> : null}
          </div>

          {message ? (
            <p className={`console-message tone-${messageTone}`} role={messageTone === "danger" ? "alert" : "status"}>
              {messageTone === "danger" ? <AlertTriangle aria-hidden="true" size={17} /> : <Check aria-hidden="true" size={17} />}
              {message}
            </p>
          ) : null}

          {filtered.length > 0 ? (
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
                      role="row"
                    >
                      <td data-label="Entreprise">
                        <button
                          className="partner-row-open"
                          type="button"
                          aria-label={`Ouvrir la fiche ${partner.companyName}`}
                          onClick={() => openPartner(partner)}
                        >
                          <strong>{partner.companyName}</strong>
                          <span>{partner.contactName}</span>
                        </button>
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
                            disabled={!ready || saving}
                            onKeyDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation();
                              setPendingDeleteId(null);
                              setSelectedPartner(null);
                              setDraft(toDraft(partner));
                            }}
                          >
                            <Edit3 aria-hidden="true" size={16} />
                          </button>
                          {pendingDeleteId === partner.id ? (
                            <button
                              className="confirm-button"
                              type="button"
                              aria-label={`Confirmer la suppression ${partner.companyName}`}
                              disabled={!ready || saving}
                              onKeyDown={(event) => event.stopPropagation()}
                              onClick={(event) => {
                                event.stopPropagation();
                                void removePartner(partner.id);
                              }}
                            >
                              <Check aria-hidden="true" size={16} />
                            </button>
                          ) : (
                            <button
                              className="danger-button"
                              type="button"
                              aria-label={`Supprimer ${partner.companyName}`}
                              disabled={!ready || saving}
                              onKeyDown={(event) => event.stopPropagation()}
                              onClick={(event) => {
                                event.stopPropagation();
                                beginDelete(partner.id);
                              }}
                            >
                              <Trash2 aria-hidden="true" size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" role="status">
              <Search aria-hidden="true" size={24} />
              <h3>Aucun partenaire ne correspond aux filtres actifs.</h3>
              <p>Retirez la recherche, le statut, le secteur ou la shortlist RFQ pour revenir au registre complet.</p>
              <button className="secondary-action" type="button" onClick={clearFilters}>
                Réinitialiser les filtres
              </button>
            </div>
          )}

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
          <section ref={dialogRef} className="partner-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="partner-detail-title" tabIndex={-1}>
            <div className="modal-heading">
              <div>
                <p className="eyebrow">Fiche partenaire</p>
                <h2 id="partner-detail-title">{selectedPartner.companyName}</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Clore la fiche partenaire"
                data-modal-initial-focus
                onClick={() => setSelectedPartner(null)}
              >
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
                <h3>Services</h3>
                <div className="detail-tags">
                  {selectedPartner.services.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </section>

              <section className="detail-block">
                <h3>Zones couvertes</h3>
                <div className="detail-tags">
                  {selectedPartner.zoneCoverage.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </section>

              <section className="detail-block">
                <h3>Notes d&apos;évaluation</h3>
                <p>{selectedPartner.notes}</p>
              </section>
            </div>

            <div className="detail-actions">
              <button className="secondary-action" type="button" onClick={() => setSelectedPartner(null)}>
                Fermer
              </button>
              <button
                className="primary-action"
                type="button"
                onClick={() => {
                  setDraft(toDraft(selectedPartner));
                  setSelectedPartner(null);
                }}
              >
                <Edit3 aria-hidden="true" size={16} />
                Modifier
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {draft ? (
        <div className="modal-backdrop" role="presentation">
          <section ref={dialogRef} className="partner-modal" role="dialog" aria-modal="true" aria-labelledby="partner-form-title" tabIndex={-1}>
            <div className="modal-heading">
              <div>
                <p className="eyebrow">Fiche partenaire</p>
                <h2 id="partner-form-title">{draft.id ? "Modifier le dossier" : "Ajouter un dossier"}</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Clore le formulaire partenaire" onClick={() => setDraft(null)} disabled={saving}>
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            <form className="partner-form" onSubmit={savePartner}>
              <label>
                Entreprise
                <input name="companyName" value={draft.companyName} onChange={updateDraft} required minLength={3} data-modal-initial-focus />
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
              <label className="wide-field">
                Zones couvertes
                <input name="zoneCoverage" value={draft.zoneCoverage} onChange={updateDraft} required minLength={2} />
              </label>
              <label className="wide-field">
                Services
                <input name="services" value={draft.services} onChange={updateDraft} required minLength={2} />
              </label>
              <label className="wide-field">
                Certifications
                <input name="certifications" value={draft.certifications} onChange={updateDraft} />
              </label>
              <label>
                Dernière évaluation
                <input name="lastAssessment" type="date" value={draft.lastAssessment} onChange={updateDraft} required />
              </label>
              <label className="wide-field">
                Notes
                <textarea name="notes" rows={4} value={draft.notes} onChange={updateDraft} required minLength={8} />
              </label>

              <div className="modal-actions">
                <button className="secondary-action" type="button" onClick={() => setDraft(null)} disabled={saving}>
                  Annuler
                </button>
                <button className="primary-action" type="submit" disabled={saving}>
                  <Save aria-hidden="true" size={16} />
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
