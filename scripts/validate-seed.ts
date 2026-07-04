import { cities, generateOpportunities, generateRfqs, generateSuppliers, sectors } from "../lib/seed-data";

const suppliers = generateSuppliers();
const rfqs = generateRfqs();
const opportunities = generateOpportunities();

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function share(count: number, total: number): number {
  return Number((count / total).toFixed(2));
}

assert(suppliers.length === 150, "Expected 150 suppliers.");
assert(rfqs.length === 60, "Expected 60 RFQs.");
assert(opportunities.length === 120, "Expected 120 opportunities.");
assert(rfqs.every((rfq) => rfq.status !== "closed_won"), "Seed must not create closed_won RFQs.");
assert(
  suppliers.every((supplier) => supplier.origin && supplier.visibility && supplier.reviewStatus),
  "Every supplier must carry origin, visibility and reviewStatus."
);

for (const city of cities.slice(0, 5)) {
  const count = suppliers.filter((supplier) => supplier.city === city.name).length;
  assert(
    Math.abs(share(count, suppliers.length) - city.targetShare) <= 0.01,
    `Unexpected city distribution for ${city.name}.`
  );
}

for (const sector of sectors) {
  const count = suppliers.filter((supplier) => supplier.sector === sector.name).length;
  assert(
    Math.abs(share(count, suppliers.length) - sector.targetShare) <= 0.01,
    `Unexpected sector distribution for ${sector.name}.`
  );
}

console.log("Seed validation passed.");
