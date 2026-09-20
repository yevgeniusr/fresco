import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { citizens, sessions } from "@/db/schema";
import { newId } from "@/lib/ids";

const COOKIE_NAME = "fresco_session";
const SESSION_DAYS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(citizenId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({
    id: newId("ses"),
    citizenId,
    tokenHash: hashToken(token),
    expiresAt,
  });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  store.delete(COOKIE_NAME);
}

export async function currentCitizen() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const rows = await db
    .select({
      id: citizens.id,
      email: citizens.email,
      displayName: citizens.displayName,
      bio: citizens.bio,
      isModerator: citizens.isModerator,
      joinedAt: citizens.createdAt,
    })
    .from(sessions)
    .innerJoin(citizens, eq(sessions.citizenId, citizens.id))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}
