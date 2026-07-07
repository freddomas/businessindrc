import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Factory,
  HeartPulse,
  Landmark,
  Network,
  RadioTower,
  Scale,
  ShieldCheck,
  Sprout,
  Wrench
} from "lucide-react";
import type { TrustedCompany } from "../components/TrustMarquee";

export type SectorGroup = {
  icon: LucideIcon;
  title: string;
  summary: string;
  items: string[];
  signal: string;
};

export type OperatingStep = {
  title: string;
  text: string;
};

export type SourcingStage = {
  label: string;
  title: string;
  text: string;
};

export type AssurancePoint = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const trustedCompanies: TrustedCompany[] = [
  { name: "Lualaba Heavy Maintenance", sector: "Engins lourds", location: "Kolwezi" },
  { name: "Katanga Build EPC", sector: "Construction industrielle", location: "Kolwezi" },
  { name: "Cyber Katanga SecOps", sector: "IT & cybersécurité", location: "Lubumbashi" },
  { name: "Copperbelt Medical Response", sector: "Support médical", location: "Likasi" },
  { name: "Lualaba Food Industries", sector: "Agro-alimentaire", location: "Kolwezi" },
  { name: "Tenke Structural Works", sector: "Charpente métallique", location: "Fungurume" },
  { name: "Katanga Legal Advisory", sector: "Droit minier", location: "Lubumbashi" },
  { name: "Tshamilemba Fiberworks", sector: "Télécommunications", location: "Lubumbashi" },
  { name: "Haut-Katanga Agri Services", sector: "Agriculture", location: "Likasi" },
  { name: "Lubumbashi Datacenter Services", sector: "Continuité numérique", location: "Lubumbashi" }
];

export const sourcingStages: SourcingStage[] = [
  {
    label: "01",
    title: "Cadrage RFQ",
    text: "Clarifier le besoin, le corridor, la criticité, les contraintes HSE, les pièces attendues et les délais de mobilisation."
  },
  {
    label: "02",
    title: "Shortlist contrôlée",
    text: "Relier le besoin aux partenaires qualifiés par secteur, ville, disponibilité, risque et capacité vérifiable."
  },
  {
    label: "03",
    title: "Vérification opérationnelle",
    text: "Lire documents, références, effectifs, certifications, couverture et fraîcheur d'évaluation avant toute recommandation."
  },
  {
    label: "04",
    title: "Mobilisation suivie",
    text: "Garder les décisions sensibles dans la console privée avec statut, notes, responsables et traçabilité."
  }
];

export const sectorGroups: SectorGroup[] = [
  {
    icon: Wrench,
    title: "Mines et maintenance industrielle",
    summary: "Capacités critiques pour sites miniers, engins, convoyeurs, arrêts programmés et pièces sensibles.",
    items: ["Maintenance engins", "Hydraulique", "Arrêts programmés", "Transit pièces critiques"],
    signal: "Priorité: continuité opérationnelle"
  },
  {
    icon: Factory,
    title: "Construction et infrastructures",
    summary: "Equipes mobilisables pour ouvrages béton, structures métalliques, bases-vie, voiries internes et lots techniques.",
    items: ["Génie civil", "Charpente", "Base-vie", "Drainage industriel"],
    signal: "Priorité: chantier maîtrisé"
  },
  {
    icon: Sprout,
    title: "Agriculture et agro-alimentaire",
    summary: "Approvisionnement local, rations industrielles, chaîne froide et contrôle qualité pour réduire la dépendance longue distance.",
    items: ["Vivrier local", "Lots secs", "Chaîne froide", "Traçabilité"],
    signal: "Priorité: sécurité d'approvisionnement"
  },
  {
    icon: RadioTower,
    title: "IT, cybersécurité et télécoms",
    summary: "Continuité numérique, connectivité site, supervision réseau et réponse incident pour environnements industriels isolés.",
    items: ["SOC managé", "Fibre optique", "Radio point à point", "Sauvegarde"],
    signal: "Priorité: résilience numérique"
  },
  {
    icon: Scale,
    title: "Juridique, finance et affaires publiques",
    summary: "Lecture réglementaire, fiscalité, contrats de sous-traitance, conformité documentaire et alignement institutionnel.",
    items: ["Droit minier", "Fiscalité", "Contrats", "Veille réglementaire"],
    signal: "Priorité: risque maîtrisé"
  },
  {
    icon: HeartPulse,
    title: "Santé, environnement et services de site",
    summary: "Support médical, évacuation, reboisement, hygiène, restauration site et suivi communautaire autour des opérations.",
    items: ["Infirmerie site", "Evacuation", "Reboisement", "Services vie site"],
    signal: "Priorité: acceptabilité terrain"
  }
];

export const operatingSteps: OperatingStep[] = [
  {
    title: "Lecture de la demande",
    text: "OCTOPUS Mining clarifie besoin, zone, criticité, contraintes HSE, délais et dépendances terrain."
  },
  {
    title: "Qualification des capacités",
    text: "Les sociétés sont analysées par documents, références, disponibilité, effectifs, certifications, couverture et risque."
  },
  {
    title: "Assemblage opérationnel",
    text: "Les compétences sont regroupées par corridor, secteur et urgence afin de constituer une réponse locale cohérente."
  },
  {
    title: "Pilotage et traçabilité",
    text: "Les décisions sensibles restent contrôlées dans une console privée avec statuts, notes et responsabilités."
  }
];

export const profilePoints: AssurancePoint[] = [
  {
    icon: BriefcaseBusiness,
    title: "Qualification métier",
    text: "Capacité réelle, références, documents, effectifs et disponibilité sont examinés avant mobilisation."
  },
  {
    icon: Network,
    title: "Coordination par corridor",
    text: "Kolwezi, Fungurume, Likasi, Lubumbashi et Kasumbalesa sont traités comme bassins opérationnels reliés."
  },
  {
    icon: Landmark,
    title: "Lecture institutionnelle",
    text: "Les sujets juridiques, fiscaux, administratifs et communautaires sont intégrés dès la qualification."
  }
];

export const assurancePoints: AssurancePoint[] = [
  {
    icon: ShieldCheck,
    title: "Qualification",
    text: "Statuts, risques, indices contextualisés et pièces de contrôle réunis dans une même lecture opérationnelle."
  },
  {
    icon: Network,
    title: "Couverture",
    text: "Kolwezi, Lubumbashi, Likasi, Fungurume, Kasumbalesa et zones industrielles adjacentes."
  },
  {
    icon: Factory,
    title: "Capacité",
    text: "Effectifs, services, certifications et disponibilité vérifiables avant mobilisation."
  },
  {
    icon: CheckCircle2,
    title: "Contrôle",
    text: "Registre privé, actions tracées et accès limités aux équipes autorisées."
  }
];
