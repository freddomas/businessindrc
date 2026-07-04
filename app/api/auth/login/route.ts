import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, resolveLocalUser, SESSION_COOKIE } from "../../../../lib/auth";
import { findUserByEmail } from "../../../../lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();

const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(120)
});

function getClientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local"
  );
}

function isLimited(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || record.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }

  record.count += 1;
  return record.count > 10;
}

export async function POST(request: Request) {
  const key = getClientKey(request);

  if (isLimited(key)) {
    return NextResponse.json({ ok: false, message: "Accès temporairement limité." }, { status: 429 });
  }

  const formData = await request.formData();
  const payload = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!payload.success) {
    return NextResponse.redirect(new URL("/connexion", request.url), { status: 303 });
  }

  const databaseUser = await findUserByEmail(payload.data.email).catch(() => null);
  const user = await resolveLocalUser(payload.data.email, payload.data.password, databaseUser);

  if (!user) {
    return NextResponse.redirect(new URL("/connexion", request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/console", request.url), { status: 303 });
  const token = await createSessionToken(user);

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
