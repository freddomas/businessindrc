import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    const sql = neon(databaseUrl);
    const result = (await sql`SELECT NOW() as now`) as Array<{ now: Date }>;

    return NextResponse.json({
      ok: true,
      database: "connected",
      now: result[0]?.now
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
