import type { Partner } from "./types";

export type SourcingUrgency = "Critique" | "Prioritaire" | "Planifié";

export type SourcingBrief = {
  id: string;
  title: string;
  corridor: string;
  sectors: string[];
  requiredCoverage: string[];
  urgency: SourcingUrgency;
  status: "A cadrer" | "Shortlist" | "Vérification";
  target: string;
  nextAction: string;
};

export const sourcingBriefs: SourcingBrief[] = [
  {
    id: "convoyeur-kolwezi",
    title: "Arrêt convoyeur Kolwezi",
    corridor: "Kolwezi - Fungurume",
    sectors: ["Mines", "Construction"],
    requiredCoverage: ["Kolwezi", "Fungurume", "Tenke"],
    urgency: "Critique",
    status: "Shortlist",
    target: "Maintenance, pièces critiques et équipe mobile sous contrainte HSE.",
    nextAction: "Comparer les partenaires qualifiés et valider disponibilité terrain."
  },
  {
    id: "site-services-likasi",
    title: "Services de site Likasi",
    corridor: "Likasi - Kambove",
    sectors: ["Support médical", "Agriculture", "Agro-alimentaire"],
    requiredCoverage: ["Likasi", "Kambove", "Lubumbashi"],
    urgency: "Prioritaire",
    status: "Vérification",
    target: "Couverture santé, rations industrielles et approvisionnement court.",
    nextAction: "Contrôler certificats, stock critique et capacité de relève."
  },
  {
    id: "resilience-lubumbashi",
    title: "Résilience numérique Lubumbashi",
    corridor: "Lubumbashi - Kasumbalesa",
    sectors: ["Experts IT & cybersécurité", "Télécommunications"],
    requiredCoverage: ["Lubumbashi", "Kasumbalesa", "Kipushi"],
    urgency: "Planifié",
    status: "A cadrer",
    target: "Continuité réseau, sauvegarde, connectivité et supervision d'incident.",
    nextAction: "Préciser niveau de service attendu et contraintes d'accès site."
  }
];

export function getBriefMatches(brief: SourcingBrief, partners: Partner[]): Partner[] {
  return partners.filter((partner) => {
    if (partner.status === "Suspendu") {
      return false;
    }

    const sectorMatch = brief.sectors.includes(partner.sector);
    const coverageMatch = [partner.city, ...partner.zoneCoverage].some((location) =>
      brief.requiredCoverage.some((required) => required.toLowerCase() === location.toLowerCase())
    );

    return sectorMatch && coverageMatch;
  });
}

export function getBriefMatchCount(brief: SourcingBrief, partners: Partner[]): number {
  return getBriefMatches(brief, partners).length;
}
