"use client";

import { FormEvent, useState } from "react";

export function LoginForm({ initialError = false }: { initialError?: boolean }) {
  const [error, setError] = useState(initialError);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(false);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "x-login-mode": "fetch" },
      body: formData
    });

    if (!response.ok) {
      setSubmitting(false);
      setError(true);
      return;
    }

    window.location.assign("/console");
  }

  return (
    <form className="login-form" action="/api/auth/login" method="post" onSubmit={submit}>
      {error ? (
        <p className="form-error" role="alert">
          Identifiants refusés ou accès temporairement limité.
        </p>
      ) : null}
      <label>
        Identifiant
        <input name="identifier" autoComplete="username" required minLength={3} />
      </label>
      <label>
        Mot de passe
        <input name="password" type="password" autoComplete="current-password" required minLength={8} />
      </label>
      <button type="submit" className="primary-action wide-action" disabled={submitting}>
        {submitting ? "Vérification" : "Entrer dans la console"}
      </button>
    </form>
  );
}
