import { Activity, Radar, Route, ShieldCheck } from "lucide-react";

export function OperationsVisual() {
  return (
    <aside className="ops-visual" aria-label="Vue opérationnelle du corridor">
      <div className="ops-visual__header">
        <span>Live coverage</span>
        <strong>Kolwezi - Lubumbashi</strong>
      </div>
      <div className="terrain-window" aria-hidden="true">
        <div className="terrain-grid" />
        <div className="terrain-route terrain-route--main" />
        <div className="terrain-route terrain-route--secondary" />
        <div className="terrain-node terrain-node--a" />
        <div className="terrain-node terrain-node--b" />
        <div className="terrain-node terrain-node--c" />
        <div className="terrain-card terrain-card--one">
          <ShieldCheck size={15} />
          <span>Tier 4</span>
        </div>
        <div className="terrain-card terrain-card--two">
          <Route size={15} />
          <span>142 km</span>
        </div>
      </div>
      <div className="ops-visual__footer">
        <div>
          <Radar aria-hidden="true" size={18} />
          <span>Signal sourcing</span>
          <strong>87%</strong>
        </div>
        <div>
          <Activity aria-hidden="true" size={18} />
          <span>Réponse terrain</span>
          <strong>18h</strong>
        </div>
      </div>
    </aside>
  );
}
