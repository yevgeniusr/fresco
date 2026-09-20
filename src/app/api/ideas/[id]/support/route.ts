import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { ideaSupports } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { absoluteUrl, redirectWith, safeReturnTo } from "@/lib/http";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const citizen = await currentCitizen();
  const { id } = await context.params;
  const form = await request.formData();
  const returnTo = safeReturnTo(form.get("returnTo"), "/app");
  if (!citizen) return NextResponse.redirect(absoluteUrl(request, `/login?returnTo=${encodeURIComponent(returnTo)}`), 303);
  await db.insert(ideaSupports).values({ ideaId: id, citizenId: citizen.id }).onConflictDoNothing();
  revalidatePath(returnTo);
  return redirectWith(request, returnTo, "success", "Support recorded as a community signal of interest.");
}
