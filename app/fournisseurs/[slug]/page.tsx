import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock, FileCheck2, MapPin, Radius, Truck } from "lucide-react";
import { TopNav } from "../../../components/TopNav";
import { formatDisplayText } from "../../../lib/display";
import { getSupplierBySlug } from "../../../lib/repository";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SupplierProfile({ params }: PageProps) {
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
          <ArrowLeft aria-hidden="true" size={16} />
          Retour prestataires
        </Link>
        <section className="profile-hero">
          <div>
            <p>{supplier.city}</p>
            <h1>{formatDisplayText(supplier.name)}</h1>
            <span>{formatDisplayText(supplier.sector)}</span>
          </div>
          <aside className="profile-score" aria-label={`Score ${supplier.score} sur 100`}>
            <strong>{supplier.score}</strong>
            <span>score OCTOPUS</span>
          </aside>
        </section>

        <section className="profile-grid">
          <article className="profile-panel">
            <h2>Capacités confirmées</h2>
            <div className="profile-facts">
              <span>
                <Truck aria-hidden="true" size={17} />
                {supplier.capacity.fleet} unités terrain
              </span>
              <span>
                <Clock aria-hidden="true" size={17} />
                {supplier.capacity.responseTimeHours}h de mobilisation
              </span>
              <span>
                <Radius aria-hidden="true" size={17} />
                {supplier.capacity.serviceRadiusKm} km de couverture
              </span>
              <span>
                <MapPin aria-hidden="true" size={17} />
                {supplier.city}
              </span>
            </div>
          </article>

          <article className="profile-panel">
            <h2>Services</h2>
            <div className="service-list service-list--large">
              {supplier.services.map((service) => (
                <span key={service}>{formatDisplayText(service)}</span>
              ))}
            </div>
          </article>

          <article className="profile-panel">
            <h2>Vérification</h2>
            <div className="profile-facts">
              <span>
                <BadgeCheck aria-hidden="true" size={17} />
                {formatDisplayText(supplier.verificationLabel)}
              </span>
              {supplier.documents.map((document) => (
                <span key={document}>
                  <FileCheck2 aria-hidden="true" size={17} />
                  {formatDisplayText(document)}
                </span>
              ))}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
