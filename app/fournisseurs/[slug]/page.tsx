import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, FileCheck2, Gauge, MapPin } from "lucide-react";
import { TopNav } from "../../../components/TopNav";
import { getSupplierBySlug } from "../../../lib/repository";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SupplierProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const supplier = await getSupplierBySlug(slug);

  if (!supplier) {
    notFound();
  }

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <Link className="back-link" href="/fournisseurs">
          <ArrowLeft aria-hidden="true" size={17} />
          Retour annuaire
        </Link>
        <section className="profile-hero">
          <div>
            <p>{supplier.city}</p>
            <h1>{supplier.name}</h1>
            <div className="supplier-meta">
              <span>
                <MapPin aria-hidden="true" size={16} />
                {supplier.sector}
              </span>
              <span>
                <BadgeCheck aria-hidden="true" size={16} />
                {supplier.verificationLabel}
              </span>
            </div>
          </div>
          <div className="score-dial" aria-label={`Score ${supplier.score} sur 100`}>
            <strong>{supplier.score}</strong>
            <span>score</span>
          </div>
        </section>

        <section className="profile-grid">
          <article>
            <Gauge aria-hidden="true" size={22} />
            <h2>Capacités</h2>
            <dl>
              <div>
                <dt>Équipes</dt>
                <dd>{supplier.capacity.crew}</dd>
              </div>
              <div>
                <dt>Flotte</dt>
                <dd>{supplier.capacity.fleet}</dd>
              </div>
              <div>
                <dt>Rayon</dt>
                <dd>{supplier.capacity.serviceRadiusKm} km</dd>
              </div>
              <div>
                <dt>Réponse</dt>
                <dd>{supplier.capacity.responseTimeHours} h</dd>
              </div>
            </dl>
          </article>
          <article>
            <FileCheck2 aria-hidden="true" size={22} />
            <h2>Documents</h2>
            <ul>
              {supplier.documents.map((document) => (
                <li key={document}>{document}</li>
              ))}
            </ul>
          </article>
          <article>
            <BadgeCheck aria-hidden="true" size={22} />
            <h2>Services</h2>
            <ul>
              {supplier.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </>
  );
}
