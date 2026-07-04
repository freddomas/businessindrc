"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button className="ghost-button" type="button" onClick={logout}>
      <LogOut aria-hidden="true" size={17} />
      Sortir
    </button>
  );
}
