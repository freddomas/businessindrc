"use client";

import { useRef, useState, type PointerEvent } from "react";

export type TrustedCompany = {
  name: string;
  sector: string;
  location: string;
};

export function TrustMarquee({ companies }: { companies: TrustedCompany[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, x: 0, scrollLeft: 0 });
  const [dragging, setDragging] = useState(false);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const element = trackRef.current;
    if (!element) return;
    dragRef.current = { active: true, x: event.clientX, scrollLeft: element.scrollLeft };
    setDragging(true);
    element.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const element = trackRef.current;
    if (!element || !dragRef.current.active) return;
    element.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.x);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    const element = trackRef.current;
    dragRef.current.active = false;
    setDragging(false);
    element?.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      ref={trackRef}
      className={`trust-track${dragging ? " is-dragging" : ""}`}
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      data-allow-horizontal-scroll="true"
      tabIndex={0}
      aria-label="Sociétés du réseau OCTOPUS Mining"
    >
      {companies.map((company) => (
        <article className="trust-card" key={company.name}>
          <span className="trust-sector-chip">{company.sector}</span>
          <div className="trust-card-copy">
            <strong>{company.name}</strong>
            <small>{company.location}</small>
          </div>
        </article>
      ))}
    </div>
  );
}
