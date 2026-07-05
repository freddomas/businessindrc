"use client";

import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { cities, sectors } from "../lib/seed-data";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; id: string }
  | { status: "error"; message: string };

export function RfqForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(formData: FormData) {
    if (state.status === "submitting") {
      return;
    }

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
        message: payload.message ?? "Enregistrement indisponible pour le moment."
      });
      return;
    }

    setState({ status: "success", id: payload.id });
  }

  return (
    <form className="rfq-form" action={submit}>
      <div className="section-heading">
        <p>Portail client</p>
        <h2>Confier un besoin a OCTOPUS</h2>
        <span className="form-assurance">
          <ShieldCheck aria-hidden="true" size={15} />
          Qualification interne avant proposition
        </span>
      </div>
      <label>
        Besoin
        <span className="field-hint" id="rfq-title-hint">
          Service attendu, site, contrainte et resultat vise.
        </span>
        <input required minLength={8} name="title" autoComplete="off" aria-describedby="rfq-title-hint" />
      </label>
      <div className="form-grid">
        <label>
          Zone
          <select name="city" required>
            {cities.slice(0, 8).map((city) => (
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
        Details operationnels
        <span className="field-hint" id="rfq-lines-hint">
          Delai, documents attendus, contraintes de site et niveau de confidentialite.
        </span>
        <textarea required minLength={16} name="lines" rows={4} aria-describedby="rfq-lines-hint" />
      </label>
      <label>
        Priorite
        <select name="urgency" required>
          <option value="standard">Standard</option>
          <option value="priority">Prioritaire</option>
          <option value="critical">Critique</option>
        </select>
      </label>
      <button type="submit" disabled={state.status === "submitting"}>
        <Send aria-hidden="true" size={18} />
        {state.status === "submitting" ? "Analyse en cours" : "Envoyer le besoin"}
      </button>
      <div className="form-status" aria-live="polite">
        {state.status === "success" && `Besoin recu par OCTOPUS: ${state.id}`}
        {state.status === "error" && state.message}
      </div>
    </form>
  );
}
