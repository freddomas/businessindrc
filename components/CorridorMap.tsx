import { cities } from "../lib/seed-data";

export function CorridorMap() {
  return (
    <section className="corridor-panel" aria-labelledby="corridor-title">
      <div className="section-heading">
        <p>Couverture terrain</p>
        <h2 id="corridor-title">Corridor Grand Katanga</h2>
      </div>
      <div className="corridor-map" aria-label="Répartition des villes prioritaires">
        {cities.slice(0, 7).map((city, index) => (
          <div
            className="map-node"
            key={city.slug}
            style={{
              left: `${12 + index * 13}%`,
              top: `${64 - (index % 3) * 18}%`
            }}
          >
            <span aria-hidden="true" />
            <strong>{city.name}</strong>
          </div>
        ))}
        <div className="route-line" aria-hidden="true" />
      </div>
    </section>
  );
}
