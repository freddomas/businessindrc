import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Factory, MapPinned, Route } from "lucide-react";
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
        <section className="zone-hero zone-hero--premium">
          <MapPinned aria-hidden="true" size={30} />
          <p>Zone prioritaire</p>
          <h1>{city.name}</h1>
          <span>{Math.round(city.targetShare * 100)}% du reseau prestataires cible cette zone.</span>
        </section>

        <section className="profile-grid profile-grid--premium">
          <article>
            <Factory aria-hidden="true" size={22} />
            <h2>Secteurs dominants</h2>
            <ul>
              <li>Mines et support industriel</li>
              <li>Construction et manutention</li>
              <li>Services professionnels</li>
            </ul>
          </article>
          <article>
            <Route aria-hidden="true" size={22} />
            <h2>Points suivis</h2>
            <ul>
              <li>Disponibilite des equipes</li>
              <li>Pieces de verification</li>
              <li>Delai de mobilisation</li>
            </ul>
          </article>
          <article>
            <MapPinned aria-hidden="true" size={22} />
            <h2>Priorite OCTOPUS</h2>
            <p>Assembler une offre claire avec les prestataires les plus fiables de la zone.</p>
          </article>
        </section>

        <section className="content-band content-band--dark" aria-labelledby="zone-suppliers">
          <div className="section-heading section-heading--inline">
            <div>
              <p>Prestataires dans la zone</p>
              <h2 id="zone-suppliers">Capacites disponibles a {city.name}</h2>
            </div>
            <Link className="text-action" href="/fournisseurs">
              Voir le reseau
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="supplier-grid">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.slug} supplier={supplier} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
