import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { citizens } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { absoluteUrl, safeReturnTo, redirectWith } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { formObject, loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = loginSchema.safeParse(formObject(form));
  if (!parsed.success) return redirectWith(request, "/login", "error", "Enter a valid email and password.");
  const [citizen] = await db.select().from(citizens).where(eq(citizens.email, parsed.data.email)).limit(1);
  if (!citizen || !(await verifyPassword(parsed.data.password, citizen.passwordHash))) {
    return redirectWith(request, "/login", "error", "Email or password is incorrect.");
  }
  await createSession(citizen.id);
  return NextResponse.redirect(absoluteUrl(request, safeReturnTo(form.get("returnTo"), "/app")), 303);
}
