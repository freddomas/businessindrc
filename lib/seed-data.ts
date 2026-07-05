import type { DashboardStats, MediaAsset, Opportunity, Rfq, Supplier } from "./types";

export const SEED_ID = "OCTOPUS_B2B_SERVICES_2026";

export const cities = [
  { name: "Kolwezi", slug: "kolwezi", targetShare: 0.26 },
  { name: "Lubumbashi", slug: "lubumbashi", targetShare: 0.22 },
  { name: "Likasi", slug: "likasi", targetShare: 0.12 },
  { name: "Fungurume", slug: "fungurume", targetShare: 0.1 },
  { name: "Kasumbalesa", slug: "kasumbalesa", targetShare: 0.08 },
  { name: "Kipushi", slug: "kipushi", targetShare: 0.07 },
  { name: "Tenke", slug: "tenke", targetShare: 0.06 },
  { name: "Sakania", slug: "sakania", targetShare: 0.04 },
  { name: "Dilolo", slug: "dilolo", targetShare: 0.03 },
  { name: "Mutshatsha", slug: "mutshatsha", targetShare: 0.02 }
] as const;

export const sectors = [
  { name: "Mines", slug: "mines", targetShare: 0.18 },
  { name: "Agriculture", slug: "agriculture", targetShare: 0.1 },
  { name: "Agro-alimentaire", slug: "agro-alimentaire", targetShare: 0.09 },
  { name: "Forêts et environnement", slug: "forets-environnement", targetShare: 0.08 },
  { name: "IT et systèmes", slug: "it-systemes", targetShare: 0.09 },
  { name: "Droit des affaires", slug: "droit-affaires", targetShare: 0.07 },
  { name: "Fiscalité", slug: "fiscalite", targetShare: 0.07 },
  { name: "Comptabilité", slug: "comptabilite", targetShare: 0.07 },
  { name: "Manutention", slug: "manutention", targetShare: 0.1 },
  { name: "Construction", slug: "construction", targetShare: 0.1 },
  { name: "Énergie", slug: "energie", targetShare: 0.03 },
  { name: "HSE et conformité", slug: "hse-conformite", targetShare: 0.02 }
] as const;

const serviceBySector: Record<string, string[]> = {
  Mines: ["maintenance de site", "pièces critiques", "support forage", "atelier mobile"],
  Agriculture: ["irrigation", "mécanisation", "intrants suivis", "maintenance tracteurs"],
  "Agro-alimentaire": ["chaîne froide", "conditionnement", "contrôle qualité", "cantines industrielles"],
  "Forêts et environnement": ["reboisement", "suivi environnemental", "réhabilitation", "bois légal"],
  "IT et systèmes": ["réseaux site", "cybersécurité", "ERP terrain", "support utilisateurs"],
  "Droit des affaires": ["contrats", "contentieux", "due diligence", "local content"],
  "Fiscalité": ["déclarations", "audit fiscal", "prix de transfert", "veille fiscale"],
  "Comptabilité": ["tenue comptes", "reporting", "paie", "contrôle interne"],
  Manutention: ["levage", "chargement", "stock yard", "équipes portuaires"],
  Construction: ["génie civil", "charpente", "VRD", "maintenance bâtiments"],
  "Énergie": ["solaire hybride", "groupes électrogènes", "câblage", "maintenance électrique"],
  "HSE et conformité": ["formation HSE", "audit terrain", "plan urgence", "inspection EPI"]
};

const prefixes = [
  "Kamoa",
  "Lualaba",
  "Upemba",
  "Copperline",
  "Mwanga",
  "Tshamilemba",
  "Nzuri",
  "Kipushi",
  "Katanga",
  "Mutanda"
];

const suffixes = [
  "Field Services",
  "Industrial Partners",
  "Prime Works",
  "Technical Group",
  "Operations",
  "Advisory",
  "Supply Chain",
  "Engineering",
  "Agro Services",
  "Compliance"
];

function cityForIndex(index: number): string {
  const thresholds = [39, 72, 90, 105, 117, 128, 137, 143, 147, 150];
  const found = thresholds.findIndex((limit) => index < limit);
  return cities[Math.max(found, 0)].name;
}

function sectorForIndex(index: number): string {
  const thresholds = [27, 42, 56, 68, 82, 93, 104, 115, 130, 145, 149, 150];
  const found = thresholds.findIndex((limit) => index < limit);
  return sectors[Math.max(found, 0)].name;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateSuppliers(count = 150): Supplier[] {
  return Array.from({ length: count }, (_, index) => {
    const city = cityForIndex(index);
    const sector = sectorForIndex((index * 7) % 150);
    const prefix = prefixes[index % prefixes.length];
    const suffix = suffixes[(index * 3) % suffixes.length];
    const name = `${prefix} ${sector.split(" ")[0]} ${suffix}`;
    const tier = 2 + (index % 3);
    const services = serviceBySector[sector] ?? serviceBySector.Mines;

    return {
      slug: `${slugify(name)}-${String(index + 1).padStart(3, "0")}`,
      name,
      city,
      sector,
      verificationTier: tier,
      verificationLabel:
        tier === 4 ? "Dossier complet" : tier === 3 ? "Références contrôlées" : "Préqualification active",
      availability:
        index % 5 === 0 ? "Réserve mission prioritaire" : index % 3 === 0 ? "Équipe mobilisable" : "Capacité ouverte",
      score: 74 + ((index * 11) % 25),
      services: services.slice(0, 3),
      capacity: {
        crew: 6 + ((index * 5) % 96),
        fleet: 1 + ((index * 2) % 22),
        serviceRadiusKm: 30 + ((index * 13) % 260),
        responseTimeHours: 8 + ((index * 3) % 48)
      },
      documents:
        tier >= 4
          ? ["RCCM", "Identification nationale", "Dossier fiscal", "Références client", "Assurances"]
          : ["RCCM", "Identification nationale", "Dossier fiscal"],
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    };
  });
}

export function generateRfqs(count = 60): Rfq[] {
  const statuses: Rfq["status"][] = [
    "submitted",
    "qualified",
    "suppliers_invited",
    "responses_received",
    "shortlisted",
    "closed_lost"
  ];

  return Array.from({ length: count }, (_, index) => {
    const city = cityForIndex((index * 5) % 150);
    const sector = sectorForIndex((index * 9) % 150);

    return {
      id: `rfq-${String(index + 1).padStart(3, "0")}`,
      title: `${sector} pour opération ${city}`,
      city,
      sector,
      status: statuses[index % statuses.length],
      urgency: index % 7 === 0 ? "critical" : index % 3 === 0 ? "priority" : "standard",
      deadline: new Date(Date.UTC(2026, 6, 12 + (index % 42))).toISOString().slice(0, 10),
      lines: ["scope a cadrer", "prestataires a qualifier", "proposition OCTOPUS a structurer"],
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    };
  });
}

export function generateOpportunities(count = 120): Opportunity[] {
  const access: Opportunity["accessLevel"][] = ["mandat", "qualification", "proposition", "signature"];
  const statuses: Opportunity["status"][] = ["en_cadrage", "matching", "negociation", "pret_signature"];

  return Array.from({ length: count }, (_, index) => {
    const city = cityForIndex((index * 4) % 150);
    const sector = sectorForIndex((index * 11) % 150);

    return {
      id: `deal-${String(index + 1).padStart(3, "0")}`,
      title: `${sector} - offre de service assemblée`,
      city,
      sector,
      deadline: new Date(Date.UTC(2026, 6, 18 + (index % 55))).toISOString().slice(0, 10),
      accessLevel: access[index % access.length],
      status: statuses[(index + 1) % statuses.length],
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    };
  });
}

export function generateMediaAssets(): MediaAsset[] {
  return [
    {
      id: "procedural-scene-01",
      title: "Scène procédurale OCTOPUS",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public"],
      alt: "Scène abstraite des corridors industriels"
    },
    {
      id: "external-operations-sparks-01",
      title: "Opération terrain haute intensité",
      url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82",
      sourceDomain: "images.unsplash.com",
      sourceUrl: "https://unsplash.com/license",
      licenseUrl: "https://unsplash.com/license",
      credit: "Unsplash",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public", "editorial_hero"],
      alt: "Intervention technique avec projection d’étincelles sur site"
    },
    {
      id: "external-engineering-lab-01",
      title: "Ingénierie et qualification",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=82",
      sourceDomain: "images.unsplash.com",
      sourceUrl: "https://unsplash.com/license",
      licenseUrl: "https://unsplash.com/license",
      credit: "Unsplash",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public", "editorial_support"],
      alt: "Poste d’ingénierie dans un atelier technique lumineux"
    },
    {
      id: "external-deal-room-01",
      title: "Salle de coordination",
      url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=82",
      sourceDomain: "images.unsplash.com",
      sourceUrl: "https://unsplash.com/license",
      licenseUrl: "https://unsplash.com/license",
      credit: "Unsplash",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public", "editorial_support"],
      alt: "Réunion de coordination autour d'une table de travail"
    },
    {
      id: "private-asset-review-01",
      title: "Asset interne à revoir",
      reviewStatus: "PENDING",
      licenseStatus: "PENDING",
      isAiLike: true,
      allowedUse: ["internal_review"],
      alt: "Asset interne"
    }
  ];
}

export function getPublicMediaAssets(): MediaAsset[] {
  return generateMediaAssets().filter(
    (asset) =>
      asset.reviewStatus === "APPROVED" &&
      asset.licenseStatus === "VALID" &&
      !asset.isAiLike &&
      asset.allowedUse.includes("web_public")
  );
}

export function getSeedStats(): DashboardStats {
  const suppliers = generateSuppliers();
  const rfqs = generateRfqs();
  const opportunities = generateOpportunities();

  return {
    suppliers: suppliers.length,
    rfqs: rfqs.length,
    opportunities: opportunities.length,
    verifiedSuppliers: suppliers.filter((supplier) => supplier.verificationTier >= 3).length,
    cities: cities.length,
    approvedMedia: getPublicMediaAssets().length
  };
}

export const getDashboardStats = getSeedStats;
