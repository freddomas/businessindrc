import { redirect } from "next/navigation";
import { Activity, ShieldCheck, UserRoundCheck } from "lucide-react";
import { LogoutButton } from "../../components/LogoutButton";
import { MetricCard } from "../../components/MetricCard";
import { TopNav } from "../../components/TopNav";
import { getSessionUser } from "../../lib/auth";
import { canAccess } from "../../lib/rbac";
import { getRfqs, getStats, getSuppliers } from "../../lib/repository";

export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const user = await getSessionUser();

  if (!user || !canAccess(user.role, "view_console")) {
    redirect("/connexion");
  }

  const [stats, rfqs, suppliers] = await Promise.all([
    getStats(),
    getRfqs(8),
    getSuppliers({ limit: 8 })
  ]);

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="console-head">
          <div>
            <p>Console</p>
            <h1>Pilotage sourcing et vérification</h1>
            <span>
              {user.name} · {user.role}
            </span>
          </div>
          <LogoutButton />
        </section>

        <section className="ops-board">
          <MetricCard label="Fournisseurs" value={stats.suppliers} detail="Référentiel actif" />
          <MetricCard label="Vérifiés" value={stats.verifiedSuppliers} detail="T2 et plus" />
          <MetricCard label="RFQ" value={stats.rfqs} detail="Pipeline total" />
          <MetricCard label="Zones" value={stats.cities} detail="Couverture prioritaire" />
        </section>

        <section className="split-section">
          <article className="console-panel">
            <div className="section-heading">
              <p>RFQ</p>
              <h2>Qualification en cours</h2>
            </div>
            {rfqs.map((rfq) => (
              <div className="compact-row" key={rfq.id}>
                <Activity aria-hidden="true" size={17} />
                <span>{rfq.title}</span>
                <strong>{rfq.status}</strong>
              </div>
            ))}
          </article>
          <article className="console-panel">
            <div className="section-heading">
              <p>Vérification</p>
              <h2>Fournisseurs prioritaires</h2>
            </div>
            {suppliers.map((supplier) => (
              <div className="compact-row" key={supplier.slug}>
                <UserRoundCheck aria-hidden="true" size={17} />
                <span>{supplier.name}</span>
                <strong>T{supplier.verificationTier}</strong>
              </div>
            ))}
          </article>
        </section>

        <section className="control-strip" aria-label="Contrôles actifs">
          <ShieldCheck aria-hidden="true" size={20} />
          <span>RBAC serveur</span>
          <span>Audit RFQ</span>
          <span>Filtrage médias</span>
          <span>API publique inactive</span>
        </section>
      </main>
    </>
  );
}
