import { getSql, hasDatabaseUrl } from "./db";
import { ensureDataStore } from "./schema";
import {
  generateOpportunities,
  generateRfqs,
  generateSuppliers,
  getDashboardStats as getSeedStats,
  getPublicMediaAssets
} from "./seed-data";
import type { DashboardStats, Opportunity, Rfq, SessionUser, Supplier } from "./types";

function parseJsonArray<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return value as T;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function rowToSupplier(row: Record<string, unknown>): Supplier {
  return {
    slug: String(row.slug),
    name: String(row.name),
    city: String(row.city),
    sector: String(row.sector),
    verificationTier: Number(row.verification_tier),
    verificationLabel: String(row.verification_label),
    availability: String(row.availability),
    score: Number(row.score),
    services: parseJsonArray<string[]>(row.services, []),
    capacity: parseJsonArray<Supplier["capacity"]>(row.capacity, {
      crew: 0,
      fleet: 0,
      serviceRadiusKm: 0,
      responseTimeHours: 0
    }),
    documents: parseJsonArray<string[]>(row.documents, []),
    origin: "synthetic_seed",
    visibility: "staging_only",
    reviewStatus: "approved"
  };
}

export async function getSuppliers(filters?: {
  city?: string;
  sector?: string;
  q?: string;
  limit?: number;
}): Promise<Supplier[]> {
  const fallback = filterSuppliers(generateSuppliers(), filters);

  if (!hasDatabaseUrl()) {
    return fallback;
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const rows = (await sql`SELECT * FROM suppliers ORDER BY score DESC, name ASC`) as Array<
      Record<string, unknown>
    >;

    return filterSuppliers(rows.map(rowToSupplier), filters);
  } catch {
    return fallback;
  }
}

export async function getSupplierBySlug(slug: string): Promise<Supplier | null> {
  const suppliers = await getSuppliers();
  return suppliers.find((supplier) => supplier.slug === slug) ?? null;
}

export async function getRfqs(limit = 60): Promise<Rfq[]> {
  const fallback = generateRfqs(limit);

  if (!hasDatabaseUrl()) {
    return fallback;
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const rows = (await sql`SELECT * FROM rfqs ORDER BY deadline ASC LIMIT ${limit}`) as Array<
      Record<string, unknown>
    >;

    return rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      city: String(row.city),
      sector: String(row.sector),
      status: row.status as Rfq["status"],
      urgency: row.urgency as Rfq["urgency"],
      deadline: new Date(String(row.deadline)).toISOString().slice(0, 10),
      lines: parseJsonArray<string[]>(row.lines, []),
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    }));
  } catch {
    return fallback;
  }
}

export async function getOpportunities(limit = 120): Promise<Opportunity[]> {
  const fallback = generateOpportunities(limit);

  if (!hasDatabaseUrl()) {
    return fallback;
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const rows = (await sql`SELECT * FROM opportunities ORDER BY deadline ASC LIMIT ${limit}`) as Array<
      Record<string, unknown>
    >;

    return rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      city: String(row.city),
      sector: String(row.sector),
      deadline: new Date(String(row.deadline)).toISOString().slice(0, 10),
      accessLevel: row.access_level as Opportunity["accessLevel"],
      status: row.status as Opportunity["status"],
      origin: "synthetic_seed",
      visibility: "staging_only",
      reviewStatus: "approved"
    }));
  } catch {
    return fallback;
  }
}

export async function getStats(): Promise<DashboardStats> {
  if (!hasDatabaseUrl()) {
    return getSeedStats();
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const [supplierRows, rfqRows, opportunityRows] = await Promise.all([
      sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE verification_tier >= 2)::int as verified FROM suppliers` as Promise<
        Array<Record<string, unknown>>
      >,
      sql`SELECT COUNT(*)::int as total FROM rfqs` as Promise<Array<Record<string, unknown>>>,
      sql`SELECT COUNT(*)::int as total FROM opportunities` as Promise<
        Array<Record<string, unknown>>
      >
    ]);

    return {
      suppliers: Number(supplierRows[0]?.total ?? 0),
      verifiedSuppliers: Number(supplierRows[0]?.verified ?? 0),
      rfqs: Number(rfqRows[0]?.total ?? 0),
      opportunities: Number(opportunityRows[0]?.total ?? 0),
      cities: 8,
      approvedMedia: getPublicMediaAssets().length
    };
  } catch {
    return getSeedStats();
  }
}

export async function findUserByEmail(email: string): Promise<
  | (SessionUser & {
      passwordHash: string;
    })
  | null
> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  await ensureDataStore();
  const sql = getSql();
  const rows = (await sql`
    SELECT email, name, role, organization, password_hash
    FROM app_users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as Array<Record<string, unknown>>;
  const user = rows[0];

  if (!user) {
    return null;
  }

  return {
    email: String(user.email),
    name: String(user.name),
    role: user.role as SessionUser["role"],
    organization: String(user.organization),
    passwordHash: String(user.password_hash)
  };
}

export async function createRfq(input: {
  title: string;
  city: string;
  sector: string;
  urgency: string;
  lines: string[];
}): Promise<string> {
  await ensureDataStore();
  const sql = getSql();
  const id = `rfq-user-${Date.now()}`;
  const deadline = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    .toISOString()
    .slice(0, 10);

  await sql`
    INSERT INTO rfqs (
      id, title, city, sector, status, urgency, deadline, lines,
      origin, visibility, review_status
    )
    VALUES (
      ${id}, ${input.title}, ${input.city}, ${input.sector}, 'submitted',
      ${input.urgency}, ${deadline}, ${JSON.stringify(input.lines)}::jsonb,
      'user_submitted', 'private', 'reviewed'
    )
  `;

  await sql`
    INSERT INTO audit_logs (id, actor_email, action, target, metadata)
    VALUES (
      ${crypto.randomUUID()}, 'public-intake', 'rfq.submitted', ${id},
      ${JSON.stringify({ city: input.city, sector: input.sector })}::jsonb
    )
  `;

  return id;
}

function filterSuppliers(
  suppliers: Supplier[],
  filters?: { city?: string; sector?: string; q?: string; limit?: number }
): Supplier[] {
  const city = filters?.city?.trim().toLowerCase();
  const sector = filters?.sector?.trim().toLowerCase();
  const q = filters?.q?.trim().toLowerCase();

  return suppliers
    .filter((supplier) => !city || supplier.city.toLowerCase() === city)
    .filter((supplier) => !sector || supplier.sector.toLowerCase() === sector)
    .filter(
      (supplier) =>
        !q ||
        supplier.name.toLowerCase().includes(q) ||
        supplier.services.join(" ").toLowerCase().includes(q)
    )
    .slice(0, filters?.limit ?? suppliers.length);
}
