import { ArrowUpRight, BadgeCheck, Clock, FileCheck2, MapPin, Truck } from "lucide-react";
import { formatDisplayText } from "../lib/display";
import type { Supplier } from "../lib/types";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const scoreClass =
    supplier.score >= 92 ? "supplier-score--high" : supplier.score >= 84 ? "supplier-score--mid" : "supplier-score--base";
  const supplierName = formatDisplayText(supplier.name);

  return (
    <a
      aria-label={`Voir dossier ${supplierName}`}
      className="supplier-card"
      href={`/fournisseurs/${supplier.slug}`}
    >
      <div className="supplier-card__top">
        <div>
          <p>{supplier.city}</p>
          <h2>{supplierName}</h2>
        </div>
        <span className="tier">T{supplier.verificationTier}</span>
      </div>
      <div className="supplier-meta">
        <span>
          <MapPin aria-hidden="true" size={15} />
          {formatDisplayText(supplier.sector)}
        </span>
        <span>
          <BadgeCheck aria-hidden="true" size={15} />
          {formatDisplayText(supplier.verificationLabel)}
        </span>
      </div>
      <div className="service-list">
        {supplier.services.map((service) => (
          <span key={service}>{formatDisplayText(service)}</span>
        ))}
      </div>
      <div className={`supplier-score ${scoreClass}`} aria-label={`Score ${supplier.score} sur 100`}>
        <div aria-hidden="true" style={{ width: `${supplier.score}%` }} />
        <span>{supplier.score}/100</span>
      </div>
      <div className="capacity-strip">
        <span>
          <Truck aria-hidden="true" size={15} />
          {supplier.capacity.fleet} unités
        </span>
        <span>
          <Clock aria-hidden="true" size={15} />
          {supplier.capacity.responseTimeHours}h
        </span>
        <span>
          <FileCheck2 aria-hidden="true" size={15} />
          {supplier.documents.length} pièces
        </span>
      </div>
      <div className="supplier-card__foot">
        <strong>{formatDisplayText(supplier.availability)}</strong>
        <span className="inline-action supplier-card__link" aria-hidden="true">
          Voir dossier
          <ArrowUpRight aria-hidden="true" size={16} />
        </span>
      </div>
    </a>
  );
}
