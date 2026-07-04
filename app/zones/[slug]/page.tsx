import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Factory, MapPinned } from "lucide-react";
import { SupplierCard } from "../../../components/SupplierCard";
import { TopNav } from "../../../components/TopNav";
import { cities } from "../../../lib/seed-data";
import { getSuppliers } from "../../../lib/repository";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ZonePage({ params }: PageProps) {
  const { slug } = await params;
  const city = cities.find((item) => item.slug === slug);

  if (!city) {
    notFound();
  }

  const suppliers = await getSuppliers({ city: city.name, limit: 8 });

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="zone-hero">
          <MapPinned aria-hidden="true" size={28} />
          <p>Zone prioritaire</p>
          <h1>{city.name}</h1>
          <span>
            Couverture fournisseur estimée: {Math.round(city.targetShare * 100)}% du référentiel
          </span>
        </section>
        <section className="profile-grid">
          <article>
            <Factory aria-hidden="true" size={22} />
            <h2>Secteurs dominants</h2>
            <ul>
              <li>Mines et support industriel</li>
              <li>Logistique corridor</li>
              <li>Énergie et maintenance terrain</li>
            </ul>
          </article>
          <article>
            <Factory aria-hidden="true" size={22} />
            <h2>Risques suivis</h2>
            <ul>
              <li>Disponibilité flotte</li>
              <li>Documents fournisseur incomplets</li>
              <li>Délai de mobilisation</li>
            </ul>
          </article>
        </section>
        <section className="content-band">
          <div className="section-heading">
            <p>Couverture locale</p>
            <h2>Fournisseurs à qualifier</h2>
          </div>
          <div className="supplier-grid">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.slug} supplier={supplier} />
            ))}
          </div>
          <Link className="primary-action fit-action" href={`/fournisseurs?ville=${city.name}`}>
            Filtrer l&apos;annuaire
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </section>
      </main>
    </>
  );
}
