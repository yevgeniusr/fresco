import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { citizens } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { newId } from "@/lib/ids";
import { redirectWith } from "@/lib/http";
import { formObject, signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = signupSchema.safeParse(formObject(form));
  if (!parsed.success) return redirectWith(request, "/join", "error", parsed.error.issues[0]?.message ?? "Check your details.");
  const existing = await db.select({ id: citizens.id }).from(citizens).where(eq(citizens.email, parsed.data.email)).limit(1);
  if (existing.length) return redirectWith(request, "/join", "error", "An account already exists for that email.");
  const id = newId("cit");
  await db.insert(citizens).values({ id, ...parsed.data, passwordHash: await hashPassword(parsed.data.password) });
  await createSession(id);
  return NextResponse.redirect(new URL("/app?welcome=1", request.url), 303);
}
