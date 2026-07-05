import { hash } from "bcryptjs";
import { getSql, hasDatabaseUrl } from "./db";
import { generateMediaAssets, generateOpportunities, generateRfqs, generateSuppliers } from "./seed-data";

let bootstrapPromise: Promise<void> | null = null;

export async function ensureDataStore(): Promise<void> {
  if (!hasDatabaseUrl()) {
    return;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap(false);
  }

  await bootstrapPromise;
}

export async function resetDataStore(): Promise<void> {
  if (!hasDatabaseUrl()) {
    return;
  }

  bootstrapPromise = bootstrap(true);
  await bootstrapPromise;
}

async function bootstrap(forceSeed: boolean): Promise<void> {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS suppliers (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      sector TEXT NOT NULL,
      verification_tier INTEGER NOT NULL,
      verification_label TEXT NOT NULL,
      availability TEXT NOT NULL,
      score INTEGER NOT NULL,
      services JSONB NOT NULL,
      capacity JSONB NOT NULL,
      documents JSONB NOT NULL,
      origin TEXT NOT NULL,
      visibility TEXT NOT NULL,
      review_status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rfqs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      city TEXT NOT NULL,
      sector TEXT NOT NULL,
      status TEXT NOT NULL,
      urgency TEXT NOT NULL,
      deadline DATE NOT NULL,
      lines JSONB NOT NULL,
      origin TEXT NOT NULL,
      visibility TEXT NOT NULL,
      review_status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      city TEXT NOT NULL,
      sector TEXT NOT NULL,
      deadline DATE NOT NULL,
      access_level TEXT NOT NULL,
      status TEXT NOT NULL,
      origin TEXT NOT NULL,
      visibility TEXT NOT NULL,
      review_status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      review_status TEXT NOT NULL,
      license_status TEXT NOT NULL,
      is_ai_like BOOLEAN NOT NULL,
      allowed_use JSONB NOT NULL,
      alt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS app_users (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      organization TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      metadata JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  if (forceSeed) {
    await sql`
      TRUNCATE TABLE
        audit_logs,
        app_users,
        media_assets,
        opportunities,
        rfqs,
        suppliers
      RESTART IDENTITY
    `;
  }

  const supplierCount = (await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM suppliers`)[0]?.count ?? 0;

  if (!forceSeed && Number(supplierCount) > 0) {
    return;
  }

  await seedData();
}

export async function seedData(): Promise<void> {
  const sql = getSql();

  for (const supplier of generateSuppliers()) {
    await sql`
      INSERT INTO suppliers (
        slug, name, city, sector, verification_tier, verification_label,
        availability, score, services, capacity, documents, origin, visibility,
        review_status
      )
      VALUES (
        ${supplier.slug}, ${supplier.name}, ${supplier.city}, ${supplier.sector},
        ${supplier.verificationTier}, ${supplier.verificationLabel},
        ${supplier.availability}, ${supplier.score},
        ${JSON.stringify(supplier.services)}::jsonb,
        ${JSON.stringify(supplier.capacity)}::jsonb,
        ${JSON.stringify(supplier.documents)}::jsonb,
        ${supplier.origin}, ${supplier.visibility}, ${supplier.reviewStatus}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  for (const rfq of generateRfqs()) {
    await sql`
      INSERT INTO rfqs (
        id, title, city, sector, status, urgency, deadline, lines,
        origin, visibility, review_status
      )
      VALUES (
        ${rfq.id}, ${rfq.title}, ${rfq.city}, ${rfq.sector},
        ${rfq.status}, ${rfq.urgency}, ${rfq.deadline},
        ${JSON.stringify(rfq.lines)}::jsonb,
        ${rfq.origin}, ${rfq.visibility}, ${rfq.reviewStatus}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }

  for (const opportunity of generateOpportunities()) {
    await sql`
      INSERT INTO opportunities (
        id, title, city, sector, deadline, access_level, status,
        origin, visibility, review_status
      )
      VALUES (
        ${opportunity.id}, ${opportunity.title}, ${opportunity.city},
        ${opportunity.sector}, ${opportunity.deadline}, ${opportunity.accessLevel},
        ${opportunity.status}, ${opportunity.origin}, ${opportunity.visibility},
        ${opportunity.reviewStatus}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }

  for (const asset of generateMediaAssets()) {
    await sql`
      INSERT INTO media_assets (
        id, title, review_status, license_status, is_ai_like, allowed_use, alt
      )
      VALUES (
        ${asset.id}, ${asset.title}, ${asset.reviewStatus}, ${asset.licenseStatus},
        ${asset.isAiLike}, ${JSON.stringify(asset.allowedUse)}::jsonb, ${asset.alt}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }

  const passwordHash = await hash("octopus2026!", 10);
  const users = [
    ["admin@octopus.local", "Administrateur plateforme", "SuperAdmin", "OCTOPUS Mining"],
    ["deals@octopus.local", "Deal desk", "SourcingManager", "OCTOPUS Mining"],
    ["client@octopus.local", "Client industriel", "BuyerAdmin", "Client entreprise"]
  ] as const;

  for (const [email, name, role, organization] of users) {
    await sql`
      INSERT INTO app_users (email, name, role, organization, password_hash)
      VALUES (${email}, ${name}, ${role}, ${organization}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
    `;
  }
}
