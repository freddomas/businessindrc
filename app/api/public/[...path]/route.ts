import { NextResponse } from "next/server";
import { getFeatureFlags } from "../../../../lib/feature-flags";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!getFeatureFlags().PUBLIC_API_ENABLED) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json({ ok: false }, { status: 501 });
}

export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
