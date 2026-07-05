"use client";

import { useEffect } from "react";

export function InteractiveBackdrop() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const root = document.documentElement;
    let frame = 0;

    const updatePointer = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
      });
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return <div className="interactive-backdrop" aria-hidden="true" />;
}
