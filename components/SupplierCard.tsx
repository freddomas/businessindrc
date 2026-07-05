import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock, FileCheck2, MapPin, Truck } from "lucide-react";
import type { Supplier } from "../lib/types";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const scoreClass =
    supplier.score >= 92 ? "supplier-score--high" : supplier.score >= 84 ? "supplier-score--mid" : "supplier-score--base";

  return (
    <article className="supplier-card">
      <div className="supplier-card__top">
        <div>
          <p>{supplier.city}</p>
          <h2>{supplier.name}</h2>
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
      <div className={`supplier-score ${scoreClass}`} aria-label={`Score ${supplier.score} sur 100`}>
        <div aria-hidden="true" style={{ width: `${supplier.score}%` }} />
        <span>{supplier.score}/100</span>
      </div>
      <div className="capacity-strip">
        <span>
          <Truck aria-hidden="true" size={15} />
          {supplier.capacity.fleet} unites
        </span>
        <span>
          <Clock aria-hidden="true" size={15} />
          {supplier.capacity.responseTimeHours}h
        </span>
        <span>
          <FileCheck2 aria-hidden="true" size={15} />
          {supplier.documents.length} pieces
        </span>
      </div>
      <div className="supplier-card__foot">
        <strong>{supplier.availability}</strong>
        <Link
          aria-label={`Voir dossier ${supplier.name}`}
          className="inline-action supplier-card__link"
          href={`/fournisseurs/${supplier.slug}`}
        >
          Voir dossier
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  );
}
