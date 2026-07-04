import { CalendarClock, Layers3, Radar } from "lucide-react";
import { TopNav } from "../../components/TopNav";
import { getOpportunities } from "../../lib/repository";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities(60);

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="page-head page-head--visual">
          <div>
            <p>Pipeline industriel</p>
            <h1>Opportunités opérationnelles</h1>
            <span>{opportunities.length} besoins actifs ou en qualification sur les zones prioritaires.</span>
          </div>
          <div className="page-head__plate" aria-hidden="true">
            <Radar size={28} />
            <span>Sourcing radar</span>
          </div>
        </section>

        <section className="opportunity-list opportunity-list--premium">
          {opportunities.map((opportunity, index) => (
            <article className="opportunity-item" key={opportunity.id}>
              <div className="opportunity-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <p>{opportunity.city}</p>
                <h2>{opportunity.title}</h2>
                <span>{opportunity.sector}</span>
              </div>
              <div className="opportunity-meta">
                <span>
                  <CalendarClock aria-hidden="true" size={16} />
                  {opportunity.deadline}
                </span>
                <span>
                  <Layers3 aria-hidden="true" size={16} />
                  {opportunity.accessLevel}
                </span>
                <strong>{opportunity.status}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
