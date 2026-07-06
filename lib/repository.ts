import { getSql, hasDatabaseUrl } from "./db";
import { ensureDataStore } from "./schema";
import { getSeedPartners, getSeedStats, sectors } from "./seed-data";
import type { DashboardStats, Partner, PartnerFilters, PartnerInput, SessionUser } from "./types";

function parseJson<T>(value: unknown, fallback: T): T {
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

function rowToPartner(row: Record<string, unknown>): Partner {
  return {
    id: String(row.id),
    companyName: String(row.company_name),
    sector: String(row.sector),
    city: String(row.city),
    province: String(row.province) as Partner["province"],
    contactName: String(row.contact_name),
    contactTitle: String(row.contact_title),
    phone: String(row.phone),
    email: String(row.email),
    status: String(row.status) as Partner["status"],
    riskLevel: String(row.risk_level) as Partner["riskLevel"],
    readinessScore: Number(row.readiness_score),
    workforce: Number(row.workforce),
    annualCapacity: String(row.annual_capacity),
    zoneCoverage: parseJson<string[]>(row.zone_coverage, []),
    services: parseJson<string[]>(row.services, []),
    certifications: parseJson<string[]>(row.certifications, []),
    lastAssessment: new Date(String(row.last_assessment)).toISOString().slice(0, 10),
    notes: String(row.notes)
  };
}

function applyFilters(partners: Partner[], filters: PartnerFilters = {}): Partner[] {
  const sector = filters.sector?.trim().toLowerCase();
  const city = filters.city?.trim().toLowerCase();
  const status = filters.status?.trim().toLowerCase();
  const query = filters.query?.trim().toLowerCase();

  return partners
    .filter((partner) => !sector || partner.sector.toLowerCase() === sector)
    .filter((partner) => !city || partner.city.toLowerCase() === city)
    .filter((partner) => !status || partner.status.toLowerCase() === status)
    .filter((partner) => {
      if (!query) return true;
      return [
        partner.companyName,
        partner.sector,
        partner.city,
        partner.contactName,
        partner.services.join(" "),
        partner.zoneCoverage.join(" ")
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => b.readinessScore - a.readinessScore || a.companyName.localeCompare(b.companyName));
}

export function getSectors(): string[] {
  return [...sectors];
}

export async function listPartners(filters?: PartnerFilters): Promise<Partner[]> {
  const fallback = applyFilters(getSeedPartners(), filters);

  if (!hasDatabaseUrl()) {
    return fallback;
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const rows = await sql`SELECT * FROM partners ORDER BY readiness_score DESC, company_name ASC`;
    return applyFilters(rows.map(rowToPartner), filters);
  } catch {
    return fallback;
  }
}

export async function getPartner(id: string): Promise<Partner | null> {
  const fallback = getSeedPartners().find((partner) => partner.id === id) ?? null;

  if (!hasDatabaseUrl()) {
    return fallback;
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const rows = await sql`SELECT * FROM partners WHERE id = ${id} LIMIT 1`;
    return rows[0] ? rowToPartner(rows[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasDatabaseUrl()) {
    return getSeedStats();
  }

  try {
    await ensureDataStore();
    const sql = getSql();
    const rows = await sql<{
      total: number;
      qualified: number;
      under_review: number;
      average_readiness: number;
      sectors: number;
      cities: number;
    }>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'Qualifié')::int AS qualified,
        COUNT(*) FILTER (WHERE status = 'En analyse')::int AS under_review,
        COALESCE(ROUND(AVG(readiness_score)), 0)::int AS average_readiness,
        COUNT(DISTINCT sector)::int AS sectors,
        COUNT(DISTINCT city)::int AS cities
      FROM partners
    `;
    const row = rows[0];

    return {
      total: Number(row?.total ?? 0),
      qualified: Number(row?.qualified ?? 0),
      underReview: Number(row?.under_review ?? 0),
      averageReadiness: Number(row?.average_readiness ?? 0),
      sectors: Number(row?.sectors ?? 0),
      cities: Number(row?.cities ?? 0)
    };
  } catch {
    return getSeedStats();
  }
}

export async function findUserByIdentifier(
  identifier: string
): Promise<(SessionUser & { passwordHash: string }) | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  await ensureDataStore();
  const normalized = identifier.trim().toLowerCase();
  const sql = getSql();
  const rows = await sql`
    SELECT email, COALESCE(username, email) AS username, name, role, organization, password_hash
    FROM app_users
    WHERE LOWER(email) = ${normalized} OR LOWER(COALESCE(username, '')) = ${normalized}
    LIMIT 1
  `;
  const user = rows[0];

  if (!user) {
    return null;
  }

  return {
    username: String(user.username),
    email: String(user.email),
    name: String(user.name),
    role: user.role as SessionUser["role"],
    organization: String(user.organization),
    passwordHash: String(user.password_hash)
  };
}

export async function createPartner(input: PartnerInput, actor: SessionUser): Promise<Partner> {
  await ensureDataStore();
  const sql = getSql();
  const id = input.id ?? crypto.randomUUID();

  await sql`
    INSERT INTO partners (
      id, company_name, sector, city, province, contact_name, contact_title,
      phone, email, status, risk_level, readiness_score, workforce,
      annual_capacity, zone_coverage, services, certifications,
      last_assessment, notes
    )
    VALUES (
      ${id}, ${input.companyName}, ${input.sector}, ${input.city},
      ${input.province}, ${input.contactName}, ${input.contactTitle},
      ${input.phone}, ${input.email}, ${input.status}, ${input.riskLevel},
      ${input.readinessScore}, ${input.workforce}, ${input.annualCapacity},
      ${JSON.stringify(input.zoneCoverage)}::jsonb,
      ${JSON.stringify(input.services)}::jsonb,
      ${JSON.stringify(input.certifications)}::jsonb,
      ${input.lastAssessment}, ${input.notes}
    )
  `;

  await writeAuditLog(actor.email, "partner.create", id, { companyName: input.companyName });
  const created = await getPartner(id);

  if (!created) {
    throw new Error("Partner creation failed.");
  }

  return created;
}

export async function updatePartner(id: string, input: PartnerInput, actor: SessionUser): Promise<Partner | null> {
  await ensureDataStore();
  const sql = getSql();

  await sql`
    UPDATE partners SET
      company_name = ${input.companyName},
      sector = ${input.sector},
      city = ${input.city},
      province = ${input.province},
      contact_name = ${input.contactName},
      contact_title = ${input.contactTitle},
      phone = ${input.phone},
      email = ${input.email},
      status = ${input.status},
      risk_level = ${input.riskLevel},
      readiness_score = ${input.readinessScore},
      workforce = ${input.workforce},
      annual_capacity = ${input.annualCapacity},
      zone_coverage = ${JSON.stringify(input.zoneCoverage)}::jsonb,
      services = ${JSON.stringify(input.services)}::jsonb,
      certifications = ${JSON.stringify(input.certifications)}::jsonb,
      last_assessment = ${input.lastAssessment},
      notes = ${input.notes},
      updated_at = NOW()
    WHERE id = ${id}
  `;

  await writeAuditLog(actor.email, "partner.update", id, { companyName: input.companyName });
  return getPartner(id);
}

export async function deletePartner(id: string, actor: SessionUser): Promise<boolean> {
  await ensureDataStore();
  const sql = getSql();
  const rows = await sql<{ id: string }>`DELETE FROM partners WHERE id = ${id} RETURNING id`;
  const deleted = rows.length > 0;

  if (deleted) {
    await writeAuditLog(actor.email, "partner.delete", id, {});
  }

  return deleted;
}

async function writeAuditLog(actorEmail: string, action: string, target: string, metadata: Record<string, unknown>) {
  const sql = getSql();
  await sql`
    INSERT INTO audit_logs (id, actor_email, action, target, metadata)
    VALUES (${crypto.randomUUID()}, ${actorEmail}, ${action}, ${target}, ${JSON.stringify(metadata)}::jsonb)
  `;
}
