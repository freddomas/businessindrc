"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cities, sectors } from "../lib/seed-data";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; id: string }
  | { status: "error"; message: string };

export function RfqForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(formData: FormData) {
    setState({ status: "submitting" });
    const response = await fetch("/api/rfq", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const payload = (await response.json()) as { id?: string; message?: string };

    if (!response.ok || !payload.id) {
      setState({
        status: "error",
        message: payload.message ?? "Demande non enregistrée"
      });
      return;
    }

    setState({ status: "success", id: payload.id });
  }

  return (
    <form className="rfq-form" action={submit}>
      <div className="section-heading">
        <p>Demande de cotation</p>
        <h2>Qualifier un besoin terrain</h2>
      </div>
      <label>
        Besoin
        <input
          required
          minLength={8}
          name="title"
          autoComplete="off"
          placeholder="Transport, HSE, IT, énergie..."
        />
      </label>
      <div className="form-grid">
        <label>
          Ville
          <select name="city" required>
            {cities.slice(0, 7).map((city) => (
              <option key={city.slug} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Secteur
          <select name="sector" required>
            {sectors.map((sector) => (
              <option key={sector.slug} value={sector.name}>
                {sector.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Lignes de besoin
        <textarea
          required
          minLength={16}
          name="lines"
          rows={4}
          placeholder="Capacité attendue, délai, documents requis"
        />
      </label>
      <label>
        Urgence
        <select name="urgency" required>
          <option value="standard">Standard</option>
          <option value="priority">Prioritaire</option>
          <option value="critical">Critique</option>
        </select>
      </label>
      <button type="submit" disabled={state.status === "submitting"}>
        <Send aria-hidden="true" size={18} />
        {state.status === "submitting" ? "Enregistrement..." : "Soumettre"}
      </button>
      <div className="form-status" aria-live="polite">
        {state.status === "success" && `Demande reçue: ${state.id}`}
        {state.status === "error" && state.message}
      </div>
    </form>
  );
}
