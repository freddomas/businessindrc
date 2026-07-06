import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role, SessionUser } from "./types";

export const SESSION_COOKIE = "gkih_session";

const localUsers: Array<SessionUser & { password: string }> = [
  {
    username: "admin",
    email: "admin@octopus.local",
    name: "Administrateur OCTOPUS",
    role: "Admin",
    organization: "OCTOPUS Mining",
    password: "demo2026!"
  }
];

function getSecret(): Uint8Array {
  const value =
    process.env.AUTH_SECRET ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    "local-session-secret-change-before-commercial-use";

  return new TextEncoder().encode(value);
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
  if (databaseUser && (await compare(password, databaseUser.passwordHash))) {
    return {
      username: databaseUser.username,
      email: databaseUser.email,
      name: databaseUser.name,
      role: databaseUser.role,
      organization: databaseUser.organization
    };
  }

  if (process.env.LOCAL_ADMIN_ENABLED?.toLowerCase() === "false") {
    return null;
  }

  const normalized = identifier.trim().toLowerCase();
  const localUser = localUsers.find(
    (user) => user.username === normalized || user.email.toLowerCase() === normalized
  );

  if (!localUser || localUser.password !== password) {
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
