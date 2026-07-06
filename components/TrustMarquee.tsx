"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

export type TrustedCompany = {
  name: string;
  sector: string;
  mark: string;
};

export function TrustMarquee({ companies }: { companies: TrustedCompany[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, x: 0, scrollLeft: 0 });
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const items = useMemo(() => [...companies, ...companies, ...companies], [companies]);

  useEffect(() => {
    const element = trackRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previous = performance.now();
    let positioned = false;

    const tick = (time: number) => {
      if (!positioned && element.scrollWidth > 0) {
        element.scrollLeft = element.scrollWidth / 3;
        positioned = true;
      }

      const delta = time - previous;
      previous = time;

      if (!paused && !dragRef.current.active) {
        element.scrollLeft += delta * 0.028;
      }

      const segment = element.scrollWidth / 3;
      if (segment > 0) {
        if (element.scrollLeft < segment * 0.45) element.scrollLeft += segment;
        if (element.scrollLeft > segment * 1.55) element.scrollLeft -= segment;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused]);

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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-allow-horizontal-scroll="true"
      tabIndex={0}
        aria-label="Sociétés du réseau OCTOPUS Mining"
      >
        {items.map((company, index) => (
          <article className="trust-card" key={`${company.name}-${index}`}>
            <div className="trust-logo-mark" aria-hidden="true">
              <span>{company.mark}</span>
            </div>
            <div className="trust-card-copy">
              <strong>{company.name}</strong>
              <small>{company.sector}</small>
            </div>
          </article>
        ))}
      </div>
  );
}
