import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, resolveUser, SESSION_COOKIE } from "../../../../lib/auth";
import { findUserByIdentifier } from "../../../../lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();

const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(160),
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
  const requestUrl = new URL(request.url);
  const secureCookie =
    requestUrl.protocol === "https:" || request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https";
  const wantsJson = request.headers.get("x-login-mode") === "fetch";

  if (isLimited(key)) {
    if (wantsJson) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }
    return NextResponse.redirect(new URL("/connexion?error=limited", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const payload = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password")
  });

  if (!payload.success) {
    if (wantsJson) {
      return NextResponse.json({ ok: false }, { status: 422 });
    }
    return NextResponse.redirect(new URL("/connexion?error=invalid", request.url), { status: 303 });
  }

  const localUser = await resolveUser(payload.data.identifier, payload.data.password, null);
  const databaseUser = localUser ? null : await findUserByIdentifier(payload.data.identifier).catch(() => null);
  const user = localUser ?? (await resolveUser(payload.data.identifier, payload.data.password, databaseUser));

  if (!user) {
    if (wantsJson) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/connexion?error=invalid", request.url), { status: 303 });
  }

  const response = wantsJson
    ? NextResponse.json({ ok: true, redirectTo: "/console" })
    : NextResponse.redirect(new URL("/console", request.url), { status: 303 });
  const token = await createSessionToken(user);

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
