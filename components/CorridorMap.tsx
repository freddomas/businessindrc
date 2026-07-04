import { cities } from "../lib/seed-data";

export function CorridorMap() {
  return (
    <section className="corridor-panel" aria-labelledby="corridor-title">
      <div className="section-heading section-heading--inline">
        <div>
          <p>Couverture terrain</p>
          <h2 id="corridor-title">Corridor Grand Katanga</h2>
        </div>
        <span>7 zones prioritaires</span>
      </div>
      <div className="corridor-map" aria-label="Répartition des villes prioritaires">
        <div className="corridor-map__scan" aria-hidden="true" />
        {cities.slice(0, 7).map((city, index) => (
          <div
            className={`map-node map-node--${index + 1}`}
            key={city.slug}
          >
            <span aria-hidden="true" />
            <strong>{city.name}</strong>
          </div>
        ))}
        <div className="route-line" aria-hidden="true" />
      </div>
      <div className="corridor-legend">
        <span>Qualification</span>
        <span>Mobilisation</span>
        <span>Shortlist</span>
      </div>
    </section>
  );
}
