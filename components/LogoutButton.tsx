"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function logout() {
    if (busy) return;

    setBusy(true);
    setFailed(false);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);

      if (response?.ok) {
        window.location.assign("/");
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }

    setBusy(false);
    setFailed(true);
  }

  return (
    <>
      <button className="ghost-button" type="button" disabled={busy} onClick={logout}>
        <LogOut aria-hidden="true" size={17} />
        {busy ? "Fermeture" : "Sortir"}
      </button>
      {failed ? (
        <span className="session-error" role="alert">
          Fermeture refusée.
        </span>
      ) : null}
    </>
  );
}
