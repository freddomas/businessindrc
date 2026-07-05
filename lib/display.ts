import type { Opportunity, Rfq } from "./types";

const displayTextReplacements: Array<[RegExp, string]> = [
  [/\bComptabilite\b/g, "Comptabilité"],
  [/\bFiscalite\b/g, "Fiscalité"],
  [/\bForets et environnement\b/g, "Forêts et environnement"],
  [/\bForets\b/g, "Forêts"],
  [/\bEnergie\b/g, "Énergie"],
  [/\bIT et systemes\b/g, "IT et systèmes"],
  [/\bHSE et conformite\b/g, "HSE et conformité"],
  [/\bPrequalification active\b/g, "Préqualification active"],
  [/\bReferences controlees\b/g, "Références contrôlées"],
  [/\bEquipe mobilisable\b/g, "Équipe mobilisable"],
  [/\bReserve mission prioritaire\b/g, "Réserve mission prioritaire"],
  [/\bCapacite ouverte\b/g, "Capacité ouverte"],
  [/\boffre de service assemblee\b/g, "offre de service assemblée"],
  [/\bchaine froide\b/g, "chaîne froide"],
  [/\brehabilitation\b/g, "réhabilitation"],
  [/\bpieces critiques\b/g, "pièces critiques"],
  [/\bmecanisation\b/g, "mécanisation"],
  [/\bcontrole qualite\b/g, "contrôle qualité"],
  [/\bgenie civil\b/g, "génie civil"],
  [/\bmaintenance batiments\b/g, "maintenance bâtiments"],
  [/\breseaux site\b/g, "réseaux site"],
  [/\bcybersecurite\b/g, "cybersécurité"],
  [/\bdeclarations\b/g, "déclarations"],
  [/\bgroupes electrogenes\b/g, "groupes électrogènes"],
  [/\bcablage\b/g, "câblage"],
  [/\bmaintenance electrique\b/g, "maintenance électrique"],
  [/\bbois legal\b/g, "bois légal"],
  [/\bVerification complete\b/g, "Vérification complète"],
  [/\bReferences client\b/g, "Références client"]
];

export function formatDisplayText(value: string): string {
  return displayTextReplacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export function formatRfqStatus(status: Rfq["status"]): string {
  const labels: Record<Rfq["status"], string> = {
    draft: "Brouillon",
    submitted: "Reçu",
    qualified: "Qualifié",
    suppliers_invited: "Prestataires invités",
    responses_received: "Réponses reçues",
    shortlisted: "Shortlist",
    closed_won: "Signé",
    closed_lost: "Archivé",
    cancelled: "Annulé"
  };

  return labels[status] ?? status;
}

export function formatOpportunityStatus(status: Opportunity["status"]): string {
  const labels: Record<Opportunity["status"], string> = {
    en_cadrage: "En cadrage",
    matching: "Matching",
    negociation: "Négociation",
    pret_signature: "Prêt signature"
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
