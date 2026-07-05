import type { Opportunity, Rfq } from "./types";

export function formatRfqStatus(status: Rfq["status"]): string {
  const labels: Record<Rfq["status"], string> = {
    draft: "Brouillon",
    submitted: "Recu",
    qualified: "Qualifie",
    suppliers_invited: "Prestataires invites",
    responses_received: "Reponses recues",
    shortlisted: "Shortlist",
    closed_won: "Signe",
    closed_lost: "Archive",
    cancelled: "Annule"
  };

  return labels[status] ?? status;
}

export function formatOpportunityStatus(status: Opportunity["status"]): string {
  const labels: Record<Opportunity["status"], string> = {
    en_cadrage: "En cadrage",
    matching: "Matching",
    negociation: "Negociation",
    pret_signature: "Pret signature"
  };

  return labels[status] ?? status;
}

export function formatAccessLevel(accessLevel: Opportunity["accessLevel"]): string {
  const labels: Record<Opportunity["accessLevel"], string> = {
    mandat: "Mandat",
    qualification: "Qualification",
    proposition: "Proposition",
    signature: "Signature"
  };

  return labels[accessLevel] ?? accessLevel;
}
