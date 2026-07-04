import Link from "next/link";
import { ArrowRight, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { CorridorMap } from "../components/CorridorMap";
import { MetricCard } from "../components/MetricCard";
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
        <section className="operations-grid" aria-labelledby="home-title">
          <div className="command-panel">
            <div className="kicker">
              <ShieldCheck aria-hidden="true" size={18} />
              Sourcing industriel vérifiable
            </div>
            <h1 id="home-title">Coordonner fournisseurs, RFQ et capacités terrain au Grand Katanga</h1>
            <p>
              Une plateforme B2B pour structurer la qualification fournisseur, les demandes de cotation,
              les shortlists et la couverture opérationnelle des zones économiques fortes de RDC.
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
          <div className="ops-board" aria-label="Indicateurs opérationnels">
            <MetricCard label="Fournisseurs" value={stats.suppliers} detail="Répartis par ville et secteur" />
            <MetricCard label="RFQ" value={stats.rfqs} detail="Statuts de qualification actifs" />
            <MetricCard label="Opportunités" value={stats.opportunities} detail="Besoins à suivre" />
            <MetricCard label="Médias validés" value={stats.approvedMedia} detail="Usage public autorisé" />
          </div>
        </section>

        <section className="split-section">
          <CorridorMap />
          <RfqForm />
        </section>

        <section className="content-band" aria-labelledby="supplier-title">
          <div className="section-heading">
            <p>Annuaire fournisseur</p>
            <h2 id="supplier-title">Capacités prêtes à qualifier</h2>
          </div>
          <div className="supplier-grid">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.slug} supplier={supplier} />
            ))}
          </div>
        </section>

        <section className="content-band" aria-labelledby="pipeline-title">
          <div className="section-heading">
            <p>Pipeline sourcing</p>
            <h2 id="pipeline-title">Demandes et opportunités en suivi</h2>
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
