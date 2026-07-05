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
  { name: "Forets et environnement", slug: "forets-environnement", targetShare: 0.08 },
  { name: "IT et systemes", slug: "it-systemes", targetShare: 0.09 },
  { name: "Droit des affaires", slug: "droit-affaires", targetShare: 0.07 },
  { name: "Fiscalite", slug: "fiscalite", targetShare: 0.07 },
  { name: "Comptabilite", slug: "comptabilite", targetShare: 0.07 },
  { name: "Manutention", slug: "manutention", targetShare: 0.1 },
  { name: "Construction", slug: "construction", targetShare: 0.1 },
  { name: "Energie", slug: "energie", targetShare: 0.03 },
  { name: "HSE et conformite", slug: "hse-conformite", targetShare: 0.02 }
] as const;

const serviceBySector: Record<string, string[]> = {
  Mines: ["maintenance de site", "pieces critiques", "support forage", "atelier mobile"],
  Agriculture: ["irrigation", "mecanisation", "intrants suivis", "maintenance tracteurs"],
  "Agro-alimentaire": ["chaine froide", "conditionnement", "controle qualite", "cantines industrielles"],
  "Forets et environnement": ["reboisement", "suivi environnemental", "rehabilitation", "bois legal"],
  "IT et systemes": ["reseaux site", "cybersecurite", "ERP terrain", "support utilisateurs"],
  "Droit des affaires": ["contrats", "contentieux", "due diligence", "local content"],
  Fiscalite: ["declarations", "audit fiscal", "prix de transfert", "veille fiscale"],
  Comptabilite: ["tenue comptes", "reporting", "paie", "controle interne"],
  Manutention: ["levage", "chargement", "stock yard", "equipes portuaires"],
  Construction: ["genie civil", "charpente", "VRD", "maintenance batiments"],
  Energie: ["solaire hybride", "groupes electrogenes", "cablage", "maintenance electrique"],
  "HSE et conformite": ["formation HSE", "audit terrain", "plan urgence", "inspection EPI"]
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
        tier === 4 ? "Dossier complet" : tier === 3 ? "References controlees" : "Prequalification active",
      availability:
        index % 5 === 0 ? "Reserve mission prioritaire" : index % 3 === 0 ? "Equipe mobilisable" : "Capacite ouverte",
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
          ? ["RCCM", "Identification nationale", "Dossier fiscal", "References client", "Assurances"]
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
      title: `${sector} pour operation ${city}`,
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
      title: `${sector} - offre de service assemblee`,
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
      title: "Scene procedurale OCTOPUS",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public"],
      alt: "Scene abstraite des corridors industriels"
    },
    {
      id: "external-operations-sparks-01",
      title: "Operation terrain haute intensite",
      url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82",
      sourceDomain: "images.unsplash.com",
      sourceUrl: "https://unsplash.com/license",
      licenseUrl: "https://unsplash.com/license",
      credit: "Unsplash",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public", "editorial_hero"],
      alt: "Intervention technique avec projection d'etincelles sur site"
    },
    {
      id: "external-engineering-lab-01",
      title: "Ingenierie et qualification",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=82",
      sourceDomain: "images.unsplash.com",
      sourceUrl: "https://unsplash.com/license",
      licenseUrl: "https://unsplash.com/license",
      credit: "Unsplash",
      reviewStatus: "APPROVED",
      licenseStatus: "VALID",
      isAiLike: false,
      allowedUse: ["web_public", "editorial_support"],
      alt: "Poste d'ingenierie dans un atelier technique lumineux"
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
      alt: "Reunion de coordination autour d'une table de travail"
    },
    {
      id: "private-asset-review-01",
      title: "Asset interne a revoir",
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
