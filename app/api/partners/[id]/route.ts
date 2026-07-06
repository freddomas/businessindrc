import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "../../../../lib/auth";
import { canAccess } from "../../../../lib/rbac";
import { deletePartner, updatePartner } from "../../../../lib/repository";

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

async function requireManager() {
  const user = await getSessionUser();

  if (!user || !canAccess(user.role, "view_console")) {
    return { user: null, response: NextResponse.json({ ok: false }, { status: 401 }) };
  }

  if (!canAccess(user.role, "manage_partners")) {
    return { user: null, response: NextResponse.json({ ok: false }, { status: 403 }) };
  }

  return { user, response: null };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireManager();

  if (response || !user) {
    return response;
  }

  const body = await request.json().catch(() => null);
  const parsed = partnerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const { id } = await context.params;
  const partner = await updatePartner(id, parsed.data, user);

  if (!partner) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({ ok: true, partner });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireManager();

  if (response || !user) {
    return response;
  }

  const { id } = await context.params;
  const deleted = await deletePartner(id, user);

  return NextResponse.json({ ok: deleted }, { status: deleted ? 200 : 404 });
}
