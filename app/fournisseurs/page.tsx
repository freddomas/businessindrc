import { Search, SlidersHorizontal } from "lucide-react";
import { SupplierCard } from "../../components/SupplierCard";
import { TopNav } from "../../components/TopNav";
import { cities, sectors } from "../../lib/seed-data";
import { getSuppliers } from "../../lib/repository";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    ville?: string;
    secteur?: string;
    q?: string;
  }>;
};

export default async function SuppliersPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const suppliers = await getSuppliers({
    city: params.ville,
    sector: params.secteur,
    q: params.q,
    limit: 48
  });

  return (
    <>
      <TopNav />
      <main className="app-shell">
        <section className="page-head page-head--visual">
          <div>
            <p>Incubateur prestataires</p>
            <h1>Réseau de sous-traitants qualifiés</h1>
            <span>{suppliers.length} dossiers affichés avec capacités, pièces et disponibilité terrain.</span>
          </div>
          <div className="page-head__plate" aria-hidden="true">
            <strong>{suppliers.length}</strong>
            <span>profils</span>
          </div>
        </section>

        <form className="filter-bar filter-bar--premium" action="/fournisseurs">
          <div className="filter-title">
            <SlidersHorizontal aria-hidden="true" size={18} />
            <span>Filtrage décisionnel</span>
          </div>
          <label>
            Recherche
            <div className="input-icon">
              <Search aria-hidden="true" size={17} />
              <input name="q" defaultValue={params.q ?? ""} autoComplete="off" />
            </div>
          </label>
          <label>
            Zone
            <select name="ville" defaultValue={params.ville ?? ""}>
              <option value="">Toutes</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Secteur
            <select name="secteur" defaultValue={params.secteur ?? ""}>
              <option value="">Tous</option>
              {sectors.map((sector) => (
                <option key={sector.slug} value={sector.name}>
                  {sector.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Appliquer</button>
        </form>

        <section className="supplier-grid supplier-grid--wide" aria-label="Liste prestataires">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.slug} supplier={supplier} />
          ))}
        </section>
      </main>
    </>
  );
}
