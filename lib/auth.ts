import { compare } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role, SessionUser } from "./types";
import { meetsPasswordPolicy } from "./password-policy";

export const SESSION_COOKIE = "octopus_expertise_session";

let developmentSecret: Uint8Array | null = null;

function getControlledLocalUser(): (SessionUser & { passwordHash: string }) | null {
  if (process.env.LOCAL_ADMIN_ENABLED?.toLowerCase() !== "true") {
    return null;
  }

  const username = process.env.LOCAL_ADMIN_USERNAME?.trim();
  const email = process.env.LOCAL_ADMIN_EMAIL?.trim();
  const passwordHash = process.env.LOCAL_ADMIN_PASSWORD_HASH?.trim();

  if (!username || !email || !passwordHash || !/^\$2[aby]\$\d{2}\$/.test(passwordHash)) {
    return null;
  }

  return {
    username,
    email,
    name: process.env.LOCAL_ADMIN_NAME?.trim() || "Administrateur OCTOPUS",
    role: "Admin",
    organization: process.env.LOCAL_ADMIN_ORGANIZATION?.trim() || "Octopus Expertise",
    passwordHash
  };
}

function getSecret(): Uint8Array {
  const value = process.env.AUTH_SECRET?.trim();

  if (value) {
    if (value.length < 32) {
      throw new Error("AUTH_SECRET must contain at least 32 characters.");
    }
    return new TextEncoder().encode(value);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }

  developmentSecret ??= randomBytes(32);
  return developmentSecret;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    organization: user.organization
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (
      typeof payload.username !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.organization !== "string"
    ) {
      return null;
    }

    return {
      username: payload.username,
      email: payload.email,
      name: payload.name,
      role: payload.role as Role,
      organization: payload.organization
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function resolveUser(
  identifier: string,
  password: string,
  databaseUser:
    | (SessionUser & {
        passwordHash: string;
      })
    | null
): Promise<SessionUser | null> {
  if (!meetsPasswordPolicy(password)) {
    return null;
  }

  if (databaseUser && (await compare(password, databaseUser.passwordHash))) {
    return {
      username: databaseUser.username,
      email: databaseUser.email,
      name: databaseUser.name,
      role: databaseUser.role,
      organization: databaseUser.organization
    };
  }

  const normalized = identifier.trim().toLowerCase();
  const localUser = getControlledLocalUser();

  if (
    !localUser ||
    (localUser.username.toLowerCase() !== normalized && localUser.email.toLowerCase() !== normalized) ||
    !(await compare(password, localUser.passwordHash))
  ) {
    return null;
  }

  return {
    username: localUser.username,
    email: localUser.email,
    name: localUser.name,
    role: localUser.role,
    organization: localUser.organization
  };
}
