import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { participations } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { redirectWith } from "@/lib/http";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const citizen = await currentCitizen(); const { id } = await context.params;
  if (!citizen) return NextResponse.redirect(new URL("/login", request.url), 303);
  await db.update(participations).set({ withdrawnAt: new Date() }).where(and(eq(participations.experimentId, id), eq(participations.citizenId, citizen.id)));
  revalidatePath(`/app/experiments/${id}`); revalidatePath("/app");
  return redirectWith(request, `/app/experiments/${id}`, "success", "You have withdrawn. No penalty, and your choice is respected.");
}
