import type { DashboardStats, MediaAsset, Opportunity, Rfq, Supplier } from "./types";

export const SEED_ID = "GKIH_V1_2026";

export const cities = [
  { name: "Kolwezi", slug: "kolwezi", targetShare: 0.32 },
  { name: "Lubumbashi", slug: "lubumbashi", targetShare: 0.28 },
  { name: "Likasi", slug: "likasi", targetShare: 0.13 },
  { name: "Fungurume", slug: "fungurume", targetShare: 0.09 },
  { name: "Kasumbalesa", slug: "kasumbalesa", targetShare: 0.08 },
  { name: "Kipushi", slug: "kipushi", targetShare: 0.04 },
  { name: "Sakania", slug: "sakania", targetShare: 0.03 },
  { name: "Tenke", slug: "tenke", targetShare: 0.03 }
] as const;

export const sectors = [
  { name: "Mines et support", slug: "mines-support", targetShare: 0.3 },
  { name: "Logistique", slug: "logistique", targetShare: 0.16 },
  { name: "IT et sécurité", slug: "it-securite", targetShare: 0.14 },
  { name: "BTP", slug: "btp", targetShare: 0.12 },
  { name: "Agro-supply", slug: "agro-supply", targetShare: 0.1 },
  { name: "HSE et conformité", slug: "hse-conformite", targetShare: 0.08 },
  { name: "Énergie", slug: "energie", targetShare: 0.06 },
  { name: "Forêt et environnement", slug: "foret-environnement", targetShare: 0.04 }
] as const;

const supplierPrefixes = [
  "Kivu",
  "Katanga",
  "Lualaba",
  "Copperbelt",
  "Nzuri",
  "Mwanga",
  "Tshamilemba",
  "Kando",
  "Ruzizi",
  "Upemba"
];

const supplierSuffixes = [
  "Industrial Services",
  "Field Operations",
  "Logistics",
  "Supply",
  "Technical Group",
  "HSE Partners",
  "Engineering",
  "Works",
  "Systems",
  "Fleet"
];

const serviceBySector: Record<string, string[]> = {
  "Mines et support": [
    "maintenance équipements",
    "EPI industriels",
    "support camp",
    "pièces critiques"
  ],
  Logistique: ["transport lourd", "entreposage", "transit corridor", "gestion flotte"],
  "IT et sécurité": ["réseaux site", "CCTV", "contrôle accès", "sauvegarde"],
  BTP: ["génie civil", "charpente", "maintenance bâtiments", "voirie"],
  "Agro-supply": ["cantines", "approvisionnement frais", "stockage froid", "contrats volume"],
  "HSE et conformité": ["audit HSE", "formations", "dossiers ARSP", "reporting local content"],
  Énergie: ["groupes électrogènes", "solaire hybride", "maintenance électrique", "câblage"],
  "Forêt et environnement": ["reboisement", "bois légal", "suivi environnemental", "réhabilitation"]
};

function cityForIndex(index: number): string {
  if (index < 48) return "Kolwezi";
  if (index < 90) return "Lubumbashi";
  if (index < 110) return "Likasi";
  if (index < 124) return "Fungurume";
  if (index < 136) return "Kasumbalesa";
  if (index < 142) return "Kipushi";
  if (index < 146) return "Sakania";
  return "Tenke";
}

function sectorForIndex(index: number): string {
  if (index < 45) return "Mines et support";
  if (index < 69) return "Logistique";
  if (index < 90) return "IT et sécurité";
  if (index < 108) return "BTP";
  if (index < 123) return "Agro-supply";
  if (index < 135) return "HSE et conformité";
  if (index < 144) return "Énergie";
  return "Forêt et environnement";
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
    const sector = sectorForIndex(index);
    const name = `${supplierPrefixes[index % supplierPrefixes.length]} ${
      supplierSuffixes[(index * 3) % supplierSuffixes.length]
    } ${String(index + 1).padStart(3, "0")}`;
    const tier = index % 11 === 0 ? 4 : index % 5 === 0 ? 3 : index % 3 === 0 ? 2 : 1;
    const services = serviceBySector[sector] ?? ["services opérationnels"];

    return {
      slug: slugify(name),
      name,
      city,
      sector,
      verificationTier: tier,
      verificationLabel:
        tier >= 4
          ? "Terrain confirmé"
          : tier === 3
            ? "Références confirmées"
            : tier === 2
              ? "Documents revus"
              : "Contact confirmé",
      availability: index % 4 === 0 ? "Capacité prioritaire" : "Capacité ouverte",
      score: 72 + ((index * 7) % 24),
      services: services.slice(0, 3),
      capacity: {
        crew: 8 + ((index * 5) % 84),
        fleet: 1 + ((index * 2) % 18),
        serviceRadiusKm: 35 + ((index * 11) % 240),
        responseTimeHours: 8 + ((index * 3) % 40)
      },
      documents:
        tier >= 3
          ? ["RCCM", "Identification nationale", "Dossier fiscal", "Références"]
          : ["RCCM", "Identification nationale"],
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
    const city = cityForIndex((index * 3) % 150);
    const sector = sectorForIndex((index * 5) % 150);

    return {
      id: `rfq-${String(index + 1).padStart(3, "0")}`,
      title: `${sector} - besoin opérationnel ${String(index + 1).padStart(2, "0")}`,
      city,
      sector,
      status: statuses[index % statuses.length],
      urgency: index % 7 === 0 ? "critical" : index % 3 === 0 ? "priority" : "standard",
      deadline: new Date(Date.UTC(2026, 6, 10 + (index % 45))).toISOString().slice(0, 10),
      lines: [
        "qualification fournisseur",
        "capacité documentée",
        "délai terrain confirmé"
      ],
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    };
  });
}

export function generateOpportunities(count = 120): Opportunity[] {
  return Array.from({ length: count }, (_, index) => {
    const city = cityForIndex((index * 2) % 150);
    const sector = sectorForIndex((index * 7) % 150);

    return {
      id: `opp-${String(index + 1).padStart(3, "0")}`,
      title: `${sector} - capacité recherchée ${String(index + 1).padStart(2, "0")}`,
      city,
      sector,
      deadline: new Date(Date.UTC(2026, 7, 1 + (index % 50))).toISOString().slice(0, 10),
      accessLevel: index % 5 === 0 ? "managed" : index % 2 === 0 ? "qualified" : "open",
      status: index % 4 === 0 ? "shortlist" : index % 3 === 0 ? "screening" : "active",
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    };
  });
}

export function generateMediaAssets(): MediaAsset[] {
  const approved = Array.from({ length: 18 }, (_, index): MediaAsset => ({
    id: `media-approved-${String(index + 1).padStart(2, "0")}`,
    title: `Asset opérationnel validé ${index + 1}`,
    reviewStatus: "APPROVED",
    licenseStatus: "VALID",
    isAiLike: false,
    allowedUse: ["web_public", "internal_dashboard"],
    alt: "Visuel de support opérationnel validé"
  }));

  return [
    ...approved,
    {
      id: "media-quarantine-01",
      title: "Asset à revoir",
      reviewStatus: "PENDING",
      licenseStatus: "PENDING",
      isAiLike: true,
      allowedUse: ["internal_review"],
      alt: "Asset non public"
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

export function getDashboardStats(): DashboardStats {
  const suppliers = generateSuppliers();
  const rfqs = generateRfqs();
  const opportunities = generateOpportunities();

  return {
    suppliers: suppliers.length,
    rfqs: rfqs.length,
    opportunities: opportunities.length,
    verifiedSuppliers: suppliers.filter((supplier) => supplier.verificationTier >= 2).length,
    cities: cities.length,
    approvedMedia: getPublicMediaAssets().length
  };
}
