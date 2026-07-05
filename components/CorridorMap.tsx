import { cities } from "../lib/seed-data";

export function CorridorMap() {
  return (
    <section className="corridor-panel" aria-labelledby="corridor-title">
      <div className="section-heading section-heading--inline">
        <div>
          <p>Zone d&apos;opération</p>
          <h2 id="corridor-title">Haut-Katanga et Lualaba</h2>
        </div>
        <span>10 points d&apos;appui</span>
      </div>
      <div className="corridor-map" aria-label="Répartition des zones prioritaires">
        <div className="corridor-map__mesh" aria-hidden="true" />
        <div className="corridor-map__scan" aria-hidden="true" />
        {cities.slice(0, 8).map((city, index) => (
          <div className={`map-node map-node--${index + 1}`} key={city.slug}>
            <span aria-hidden="true" />
            <strong>{city.name}</strong>
          </div>
        ))}
        <div className="route-line route-line--one" aria-hidden="true" />
        <div className="route-line route-line--two" aria-hidden="true" />
      </div>
      <div className="corridor-legend">
        <span>Qualification</span>
        <span>Assemblage</span>
        <span>Exécution</span>
      </div>
    </section>
  );
}
