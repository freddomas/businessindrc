import { getSql, hasDatabaseUrl } from "./db";
import { getSeedPartners } from "./seed-data";

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
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      sector TEXT NOT NULL,
      city TEXT NOT NULL,
      province TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      contact_title TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      readiness_score INTEGER NOT NULL,
      workforce INTEGER NOT NULL,
      annual_capacity TEXT NOT NULL,
      zone_coverage JSONB NOT NULL,
      services JSONB NOT NULL,
      certifications JSONB NOT NULL,
      last_assessment DATE NOT NULL,
      notes TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS app_users (
      email TEXT PRIMARY KEY,
      username TEXT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      organization TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS username TEXT`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS app_users_username_key
    ON app_users(username)
    WHERE username IS NOT NULL
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
        partners
      RESTART IDENTITY
    `;
  }

  const partnerCount = (await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM partners`)[0]?.count ?? 0;

  if (forceSeed || Number(partnerCount) === 0) {
    await seedPartners();
  }

}

export async function seedPartners(): Promise<void> {
  const sql = getSql();

  for (const partner of getSeedPartners()) {
    await sql`
      INSERT INTO partners (
        id, company_name, sector, city, province, contact_name, contact_title,
        phone, email, status, risk_level, readiness_score, workforce,
        annual_capacity, zone_coverage, services, certifications,
        last_assessment, notes
      )
      VALUES (
        ${partner.id}, ${partner.companyName}, ${partner.sector}, ${partner.city},
        ${partner.province}, ${partner.contactName}, ${partner.contactTitle},
        ${partner.phone}, ${partner.email}, ${partner.status}, ${partner.riskLevel},
        ${partner.readinessScore}, ${partner.workforce}, ${partner.annualCapacity},
        ${JSON.stringify(partner.zoneCoverage)}::jsonb,
        ${JSON.stringify(partner.services)}::jsonb,
        ${JSON.stringify(partner.certifications)}::jsonb,
        ${partner.lastAssessment}, ${partner.notes}
      )
      ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        sector = EXCLUDED.sector,
        city = EXCLUDED.city,
        province = EXCLUDED.province,
        contact_name = EXCLUDED.contact_name,
        contact_title = EXCLUDED.contact_title,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        status = EXCLUDED.status,
        risk_level = EXCLUDED.risk_level,
        readiness_score = EXCLUDED.readiness_score,
        workforce = EXCLUDED.workforce,
        annual_capacity = EXCLUDED.annual_capacity,
        zone_coverage = EXCLUDED.zone_coverage,
        services = EXCLUDED.services,
        certifications = EXCLUDED.certifications,
        last_assessment = EXCLUDED.last_assessment,
        notes = EXCLUDED.notes,
        updated_at = NOW()
    `;
  }
}
