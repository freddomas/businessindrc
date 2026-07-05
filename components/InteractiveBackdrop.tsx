"use client";

import { useEffect } from "react";

export function InteractiveBackdrop() {
  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  return <div className="ambient-backdrop" aria-hidden="true" />;
}
