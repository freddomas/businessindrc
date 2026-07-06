import { getSeedPartners, sectors } from "../lib/seed-data";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const partners = getSeedPartners();
const forbidden = /\b(undefined|null|NaN)\b|\[object Object\]|Ã©|Ã¨|Ãª|Ã |Â|�|&eacute;|&agrave;|&ccedil;/i;

assert(partners.length >= 15, "Partner registry needs enough realistic records.");
assert(new Set(partners.map((partner) => partner.id)).size === partners.length, "Partner ids must be unique.");

for (const sector of sectors) {
  assert(partners.some((partner) => partner.sector === sector), `Missing sector: ${sector}`);
}

for (const partner of partners) {
  const text = JSON.stringify(partner);
  assert(!forbidden.test(text), `Corrupted text in partner ${partner.id}`);
  assert(partner.companyName.length >= 3, `Invalid company name for ${partner.id}`);
  assert(partner.email.includes("@"), `Invalid email for ${partner.id}`);
  assert(partner.zoneCoverage.length > 0, `Missing zone coverage for ${partner.id}`);
  assert(partner.services.length > 0, `Missing services for ${partner.id}`);
  assert(partner.readinessScore >= 0 && partner.readinessScore <= 100, `Invalid score for ${partner.id}`);
}

console.log("Seed validation passed.");
