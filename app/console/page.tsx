import { redirect } from "next/navigation";
import { Activity, BadgeCheck, ClipboardList, ShieldCheck, UserRoundCheck } from "lucide-react";
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
        <section className="console-head console-head--premium">
          <div>
            <p>Console opérationnelle</p>
            <h1>Pilotage sourcing et vérification</h1>
            <span>
              {user.name} · {user.role}
            </span>
          </div>
          <LogoutButton />
        </section>

        <section className="metrics-ribbon metrics-ribbon--console">
          <MetricCard tone="teal" label="Fournisseurs" value={stats.suppliers} detail="Référentiel actif" />
          <MetricCard tone="copper" label="Vérifiés" value={stats.verifiedSuppliers} detail="T2 et plus" />
          <MetricCard tone="gold" label="RFQ" value={stats.rfqs} detail="Pipeline total" />
          <MetricCard tone="steel" label="Zones" value={stats.cities} detail="Couverture prioritaire" />
        </section>

        <section className="console-grid">
          <article className="console-panel console-panel--timeline">
            <div className="section-heading">
              <p>RFQ</p>
              <h2>Qualification en cours</h2>
            </div>
            {rfqs.map((rfq) => (
              <div className="compact-row compact-row--premium" key={rfq.id}>
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
              <div className="compact-row compact-row--premium" key={supplier.slug}>
                <UserRoundCheck aria-hidden="true" size={17} />
                <span>{supplier.name}</span>
                <strong>T{supplier.verificationTier}</strong>
              </div>
            ))}
          </article>
          <article className="console-panel console-panel--assurance">
            <div className="section-heading">
              <p>Contrôles</p>
              <h2>Garde-fous actifs</h2>
            </div>
            <div className="assurance-list">
              <span>
                <ShieldCheck aria-hidden="true" size={18} />
                RBAC serveur
              </span>
              <span>
                <ClipboardList aria-hidden="true" size={18} />
                Audit RFQ
              </span>
              <span>
                <BadgeCheck aria-hidden="true" size={18} />
                Filtrage médias
              </span>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
