import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { citizens } from "@/db/schema";
import { currentCitizen, destroySession } from "@/lib/auth";

export async function DELETE() {
  const citizen = await currentCitizen();
  if (!citizen) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.delete(citizens).where(eq(citizens.id, citizen.id));
  await destroySession();
  return NextResponse.json({ deleted: true });
}

export async function POST(request: Request) {
  const citizen = await currentCitizen();
  if (!citizen) return NextResponse.redirect(new URL("/login", request.url), 303);
  await db.delete(citizens).where(eq(citizens.id, citizen.id));
  await destroySession();
  return NextResponse.redirect(new URL("/?account=deleted", request.url), 303);
}
