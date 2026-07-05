import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  FileSearch,
  Handshake,
  Layers3,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { CommandScene } from "../components/CommandScene";
import { CorridorMap } from "../components/CorridorMap";
import { MetricCard } from "../components/MetricCard";
import { RfqForm } from "../components/RfqForm";
import { SupplierCard } from "../components/SupplierCard";
import { TopNav } from "../components/TopNav";
import { formatAccessLevel, formatOpportunityStatus } from "../lib/display";
import { getOpportunities, getStats, getSuppliers } from "../lib/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, suppliers, opportunities] = await Promise.all([
    getStats(),
    getSuppliers({ limit: 6 }),
    getOpportunities(6)
  ]);

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="hero-stage" aria-labelledby="home-title">
          <CommandScene />
          <div className="hero-copy">
            <div className="kicker">
              <ShieldCheck aria-hidden="true" size={18} />
              Deal desk B2B Haut-Katanga / Lualaba
            </div>
            <h1 id="home-title">OCTOPUS assemble les prestataires qui rendent les operations possibles</h1>
            <p>
              Une plateforme immersive pour qualifier des sous-traitants, recevoir des besoins clients et
              structurer des offres de services signees par OCTOPUS Mining.
            </p>
            <div className="action-row">
              <Link className="primary-action" href="#besoin">
                Confier un besoin
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="secondary-action" href="/fournisseurs">
                Explorer les prestataires
              </Link>
            </div>
            <div className="hero-proof-grid" aria-label="Reperes de confiance">
              <span>Prestataires prequalifies</span>
              <span>Mandats cadres</span>
              <span>Execution suivie</span>
            </div>
          </div>
          <aside className="deal-console" aria-label="Synthese operationnelle">
            <div className="deal-console__header">
              <span>Mission control</span>
              <strong>OCTOPUS Mining</strong>
            </div>
            <div className="deal-console__metric">
              <span>Portefeuille actif</span>
              <strong>{stats.opportunities}</strong>
              <small>offres a piloter</small>
            </div>
            <div className="deal-console__stack">
              <span>
                <BadgeCheck size={15} aria-hidden="true" />
                {stats.verifiedSuppliers} dossiers controles
              </span>
              <span>
                <BriefcaseBusiness size={15} aria-hidden="true" />
                {stats.rfqs} besoins structures
              </span>
              <span>
                <Sparkles size={15} aria-hidden="true" />
                {stats.cities} zones couvertes
              </span>
            </div>
          </aside>
        </section>

        <section className="metrics-ribbon" aria-label="Indicateurs operationnels">
          <MetricCard tone="teal" label="Prestataires" value={stats.suppliers} detail="Reseau qualifie par secteur" />
          <MetricCard tone="copper" label="Besoins" value={stats.rfqs} detail="Demandes client en qualification" />
          <MetricCard tone="gold" label="Offres" value={stats.opportunities} detail="Deals en cadrage ou signature" />
          <MetricCard tone="steel" label="Zones" value={stats.cities} detail="Haut-Katanga et Lualaba" />
        </section>

        <section className="process-band" aria-labelledby="process-title">
          <div className="section-heading">
            <p>Modele opere</p>
            <h2 id="process-title">Deux portails, une responsabilite contractuelle claire</h2>
          </div>
          <div className="process-steps">
            <article>
              <FileSearch aria-hidden="true" size={22} />
              <span>01</span>
              <h3>Referencer</h3>
              <p>Le prestataire depose son profil, ses capacites, ses preuves et sa zone d&apos;intervention.</p>
            </article>
            <article>
              <Layers3 aria-hidden="true" size={22} />
              <span>02</span>
              <h3>Assembler</h3>
              <p>OCTOPUS combine les bonnes competences pour creer une offre exploitable.</p>
            </article>
            <article>
              <Handshake aria-hidden="true" size={22} />
              <span>03</span>
              <h3>Signer</h3>
              <p>Le client contracte avec OCTOPUS Mining; les sous-traitants executent dans un cadre pilote.</p>
            </article>
          </div>
        </section>

        <section className="split-section split-section--feature" id="besoin">
          <CorridorMap />
          <RfqForm />
        </section>

        <section className="content-band content-band--dark" aria-labelledby="supplier-title">
          <div className="section-heading section-heading--inline">
            <div>
              <p>Incubateur prestataires</p>
              <h2 id="supplier-title">Des capacites locales presentees pour la decision</h2>
            </div>
            <Link className="text-action" href="/fournisseurs">
              Tout afficher
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="supplier-grid">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.slug} supplier={supplier} />
            ))}
          </div>
        </section>

        <section className="content-band" aria-labelledby="pipeline-title">
          <div className="section-heading section-heading--inline">
            <div>
              <p>Portail offres de services</p>
              <h2 id="pipeline-title">Le pipeline client reste lisible en un balayage</h2>
            </div>
            <span>Responsabilite OCTOPUS</span>
          </div>
          <div className="pipeline-table" role="table" aria-label="Offres de services en cours">
            <div role="row" className="pipeline-row pipeline-row--head">
              <span role="columnheader">Offre</span>
              <span role="columnheader">Zone</span>
              <span role="columnheader">Secteur</span>
              <span role="columnheader">Phase</span>
              <span role="columnheader">Statut</span>
            </div>
            {opportunities.map((opportunity) => (
              <div role="row" className="pipeline-row" key={opportunity.id}>
                <span role="cell">{opportunity.title}</span>
                <span role="cell">{opportunity.city}</span>
                <span role="cell">{opportunity.sector}</span>
                <span role="cell">{formatAccessLevel(opportunity.accessLevel)}</span>
                <span role="cell" className="status-pill">
                  {formatOpportunityStatus(opportunity.status)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="control-strip" aria-label="Garde-fous operationnels">
          <ShieldCheck aria-hidden="true" size={20} />
          <span>API publique fermee</span>
          <span>Integrations fermees</span>
          <span>Paiements fermes</span>
          <span>Medias controles</span>
        </section>
      </main>
    </>
  );
}
