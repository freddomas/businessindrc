import { redirect } from "next/navigation";
import { Activity, BadgeCheck, ClipboardList, ShieldCheck, UserRoundCheck } from "lucide-react";
import { LogoutButton } from "../../components/LogoutButton";
import { MetricCard } from "../../components/MetricCard";
import { TopNav } from "../../components/TopNav";
import { getSessionUser } from "../../lib/auth";
import { formatRfqStatus } from "../../lib/display";
import { canAccess } from "../../lib/rbac";
import { getRfqs, getStats, getSuppliers } from "../../lib/repository";

export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const user = await getSessionUser();
  if (!user || !canAccess(user.role, "view_console")) {
    redirect("/connexion");
  }

  const [stats, rfqs, suppliers] = await Promise.all([getStats(), getRfqs(8), getSuppliers({ limit: 8 })]);

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="console-head console-head--premium">
          <div>
            <p>Deal desk</p>
            <h1>Pilotage OCTOPUS des besoins et prestataires</h1>
            <span>
              {user.name} · {user.role}
            </span>
          </div>
          <LogoutButton />
        </section>

        <section className="metrics-ribbon metrics-ribbon--console">
          <MetricCard tone="teal" label="Prestataires" value={stats.suppliers} detail="Reseau actif" />
          <MetricCard tone="copper" label="Controles" value={stats.verifiedSuppliers} detail="T3 et T4" />
          <MetricCard tone="gold" label="Besoins" value={stats.rfqs} detail="Pipeline total" />
          <MetricCard tone="steel" label="Zones" value={stats.cities} detail="Couverture prioritaire" />
        </section>

        <section className="console-grid">
          <article className="console-panel console-panel--timeline">
            <div className="section-heading">
              <p>Besoins client</p>
              <h2>Qualification en cours</h2>
            </div>
            {rfqs.map((rfq) => (
              <div className="compact-row compact-row--premium" key={rfq.id}>
                <Activity aria-hidden="true" size={17} />
                <span>{rfq.title}</span>
                <strong>{formatRfqStatus(rfq.status)}</strong>
              </div>
            ))}
          </article>

          <article className="console-panel">
            <div className="section-heading">
              <p>Prestataires</p>
              <h2>Shortlist prioritaire</h2>
            </div>
            {suppliers.map((supplier) => (
              <div className="compact-row compact-row--premium" key={supplier.slug}>
                <UserRoundCheck aria-hidden="true" size={17} />
                <span>{supplier.name}</span>
                <strong>{supplier.score}/100</strong>
              </div>
            ))}
          </article>

          <article className="console-panel console-panel--guard">
            <ShieldCheck aria-hidden="true" size={22} />
            <h2>Garde-fous</h2>
            <p>Les integrations externes, paiements et API publiques restent fermes sans decision explicite.</p>
            <div className="guard-list">
              <span>
                <BadgeCheck aria-hidden="true" size={15} />
                Medias controles
              </span>
              <span>
                <ClipboardList aria-hidden="true" size={15} />
                Trace des demandes
              </span>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
