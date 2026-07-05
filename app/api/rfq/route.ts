import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl } from "../../../lib/db";
import { createRfq } from "../../../lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rfqSchema = z.object({
  title: z.string().trim().min(8).max(160),
  city: z.string().trim().min(2).max(80),
  sector: z.string().trim().min(2).max(120),
  urgency: z.enum(["standard", "priority", "critical"]),
  lines: z.string().trim().min(16).max(2000)
});

export async function POST(request: Request) {
  const payload = rfqSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ ok: false, message: "Informations invalides." }, { status: 422 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { ok: false, message: "Enregistrement indisponible pour le moment." },
      { status: 503 }
    );
  }

  const id = await createRfq({
    ...payload.data,
    lines: payload.data.lines
      .split(/\n|;/)
      .map((line) => line.trim())
      .filter(Boolean)
  }).catch(() => null);

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Enregistrement indisponible pour le moment." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
