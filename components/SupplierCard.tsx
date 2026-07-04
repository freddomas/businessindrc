import Link from "next/link";
import { BadgeCheck, Clock, MapPin, Truck } from "lucide-react";
import type { Supplier } from "../lib/types";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <article className="supplier-card">
      <div className="supplier-card__top">
        <div>
          <p>{supplier.city}</p>
          <h3>{supplier.name}</h3>
        </div>
        <span className="tier">T{supplier.verificationTier}</span>
      </div>
      <div className="supplier-meta">
        <span>
          <MapPin aria-hidden="true" size={15} />
          {supplier.sector}
        </span>
        <span>
          <BadgeCheck aria-hidden="true" size={15} />
          {supplier.verificationLabel}
        </span>
      </div>
      <div className="service-list">
        {supplier.services.map((service) => (
          <span key={service}>{service}</span>
        ))}
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
        <strong>{supplier.score}/100</strong>
      </div>
      <Link className="inline-action" href={`/fournisseurs/${supplier.slug}`}>
        Voir dossier
      </Link>
    </article>
  );
}
