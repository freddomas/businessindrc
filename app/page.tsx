import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileSearch,
  Layers3,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { CorridorMap } from "../components/CorridorMap";
import { MetricCard } from "../components/MetricCard";
import { OperationsVisual } from "../components/OperationsVisual";
import { RfqForm } from "../components/RfqForm";
import { SupplierCard } from "../components/SupplierCard";
import { TopNav } from "../components/TopNav";
import { getOpportunities, getStats, getSuppliers } from "../lib/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, suppliers, opportunities] = await Promise.all([
    getStats(),
    getSuppliers({ limit: 6 }),
    getOpportunities(5)
  ]);

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="hero-stage" aria-labelledby="home-title">
          <div className="hero-copy">
            <div className="kicker">
              <ShieldCheck aria-hidden="true" size={18} />
              Sourcing industriel vérifiable
            </div>
            <h1 id="home-title">Coordonner fournisseurs, RFQ et capacités terrain au Grand Katanga</h1>
            <p>
              Une plateforme B2B pour qualifier les fournisseurs, structurer les demandes de cotation
              et piloter les shortlists sur les zones économiques fortes de RDC.
            </p>
            <div className="action-row">
              <Link className="primary-action" href="/fournisseurs">
                Explorer l&apos;annuaire
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="secondary-action" href="/opportunites">
                Voir le pipeline
              </Link>
            </div>
          </div>
          <OperationsVisual />
        </section>

        <section className="metrics-ribbon" aria-label="Indicateurs opérationnels">
          <MetricCard
            tone="teal"
            label="Fournisseurs"
            value={stats.suppliers}
            detail="Répartis par ville et secteur"
          />
          <MetricCard tone="copper" label="RFQ" value={stats.rfqs} detail="Statuts de qualification actifs" />
          <MetricCard
            tone="gold"
            label="Opportunités"
            value={stats.opportunities}
            detail="Besoins en suivi"
          />
          <MetricCard
            tone="steel"
            label="Médias validés"
            value={stats.approvedMedia}
            detail="Usage public autorisé"
          />
        </section>

        <section className="process-band" aria-labelledby="process-title">
          <div className="section-heading">
            <p>Flux opéré</p>
            <h2 id="process-title">Du besoin terrain à la shortlist</h2>
          </div>
          <div className="process-steps">
            <article>
              <FileSearch aria-hidden="true" size={22} />
              <span>01</span>
              <h3>Qualifier</h3>
              <p>Besoin, ville, secteur, urgence et contraintes documentaires.</p>
            </article>
            <article>
              <BadgeCheck aria-hidden="true" size={22} />
              <span>02</span>
              <h3>Vérifier</h3>
              <p>Documents, références, capacité de mobilisation et disponibilité.</p>
            </article>
            <article>
              <Layers3 aria-hidden="true" size={22} />
              <span>03</span>
              <h3>Shortlister</h3>
              <p>Comparaison claire, statuts suivis, trace de décision.</p>
            </article>
          </div>
        </section>

        <section className="split-section split-section--feature">
          <CorridorMap />
          <RfqForm />
        </section>

        <section className="content-band content-band--dark" aria-labelledby="supplier-title">
          <div className="section-heading section-heading--inline">
            <div>
              <p>Annuaire fournisseur</p>
              <h2 id="supplier-title">Capacités prêtes à qualifier</h2>
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
              <p>Pipeline sourcing</p>
              <h2 id="pipeline-title">Demandes et opportunités en suivi</h2>
            </div>
            <span>Statuts non commerciaux</span>
          </div>
          <div className="pipeline-table" role="table" aria-label="Opportunités opérationnelles">
            <div role="row" className="pipeline-row pipeline-row--head">
              <span role="columnheader">Besoin</span>
              <span role="columnheader">Ville</span>
              <span role="columnheader">Secteur</span>
              <span role="columnheader">Échéance</span>
              <span role="columnheader">Statut</span>
            </div>
            {opportunities.map((opportunity) => (
              <div role="row" className="pipeline-row" key={opportunity.id}>
                <span role="cell">{opportunity.title}</span>
                <span role="cell">{opportunity.city}</span>
                <span role="cell">{opportunity.sector}</span>
                <span role="cell">{opportunity.deadline}</span>
                <span role="cell" className="status-pill">
                  {opportunity.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="control-strip" aria-label="Garde-fous V1">
          <SlidersHorizontal aria-hidden="true" size={20} />
          <span>API publique inactive</span>
          <span>Webhooks inactifs</span>
          <span>Paiements inactifs</span>
          <span>Médias filtrés avant affichage</span>
        </section>
      </main>
    </>
  );
}
