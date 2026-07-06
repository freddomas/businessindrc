import { NextResponse } from "next/server";
import { getSql } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!databaseUrl) {
    return NextResponse.json({
      ok: true,
      database: "not_configured"
    });
  }

  try {
    const sql = getSql();
    const rows = await sql<{ now: Date }>`SELECT NOW() as now`;

    return NextResponse.json({
      ok: true,
      database: "connected",
      checkedAt: rows[0]?.now
    });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error && typeof error.code === "string"
        ? error.code
        : "unknown";

    return NextResponse.json(
      {
        ok: false,
        database: "error",
        code: process.env.NODE_ENV === "production" ? "unavailable" : code
      },
      { status: 500 }
    );
  }
}
