import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "../../../lib/auth";
import { canAccess } from "../../../lib/rbac";
import { createPartner, getDashboardStats, listPartners } from "../../../lib/repository";
import type { PartnerStatus } from "../../../lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const partnerSchema = z.object({
  companyName: z.string().trim().min(3).max(120),
  sector: z.string().trim().min(3).max(80),
  city: z.string().trim().min(2).max(80),
  province: z.enum(["Lualaba", "Haut-Katanga"]),
  contactName: z.string().trim().min(3).max(100),
  contactTitle: z.string().trim().min(3).max(100),
  phone: z.string().trim().min(8).max(40),
  email: z.string().trim().email().max(160),
  status: z.enum(["Qualifié", "En analyse", "Sous réserve", "Suspendu"]),
  riskLevel: z.enum(["Bas", "Modéré", "Élevé"]),
  readinessScore: z.coerce.number().int().min(0).max(100),
  workforce: z.coerce.number().int().min(1).max(10000),
  annualCapacity: z.string().trim().min(6).max(180),
  zoneCoverage: z.array(z.string().trim().min(2).max(80)).min(1).max(12),
  services: z.array(z.string().trim().min(2).max(100)).min(1).max(12),
  certifications: z.array(z.string().trim().min(2).max(100)).max(12),
  lastAssessment: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().trim().min(8).max(500)
});

async function requireConsoleAccess() {
  const user = await getSessionUser();

  if (!user || !canAccess(user.role, "view_console")) {
    return { user: null, response: NextResponse.json({ ok: false }, { status: 401 }) };
  }

  return { user, response: null };
}

export async function GET(request: Request) {
  const { response } = await requireConsoleAccess();

  if (response) {
    return response;
  }

  const url = new URL(request.url);
  const partners = await listPartners({
    sector: url.searchParams.get("sector") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    status: (url.searchParams.get("status") as PartnerStatus | null) ?? undefined,
    query: url.searchParams.get("query") ?? undefined
  });
  const stats = await getDashboardStats();

  return NextResponse.json({ ok: true, partners, stats });
}

export async function POST(request: Request) {
  const { user, response } = await requireConsoleAccess();

  if (response || !user) {
    return response;
  }

  if (!canAccess(user.role, "manage_partners")) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = partnerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const partner = await createPartner(parsed.data, user);
  return NextResponse.json({ ok: true, partner }, { status: 201 });
}
