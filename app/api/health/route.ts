import { NextResponse } from "next/server";
import { getSql } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!databaseUrl) {
    return NextResponse.json({
      ok: true,
      database: "not_configured",
      message: "DATABASE_URL or POSTGRES_URL is not set yet."
    });
  }

  try {
    const sql = getSql();
    const result = await sql<{ now: Date }>`SELECT NOW() as now`;

    return NextResponse.json({
      ok: true,
      database: "connected",
      now: result[0]?.now
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Database health check failed."
        : error instanceof Error
          ? error.message
          : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        database: "error",
        message
      },
      { status: 500 }
    );
  }
}
