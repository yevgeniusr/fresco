import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { communitySignals } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { absoluteUrl, redirectWith } from "@/lib/http";
import { formObject, signalSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const citizen = await currentCitizen(); const { id } = await context.params;
  if (!citizen) return NextResponse.redirect(absoluteUrl(request, `/login?returnTo=/app/experiments/${id}`), 303);
  const parsed = signalSchema.safeParse(formObject(await request.formData()));
  if (!parsed.success) return redirectWith(request, `/app/experiments/${id}`, "error", "Choose a valid community signal.");
  await db.insert(communitySignals).values({ experimentId: id, citizenId: citizen.id, ...parsed.data }).onConflictDoUpdate({
    target: [communitySignals.experimentId, communitySignals.citizenId], set: { ...parsed.data, updatedAt: new Date() },
  });
  revalidatePath(`/app/experiments/${id}`);
  return redirectWith(request, `/app/experiments/${id}`, "success", "Signal recorded. It informs the moderator; it is not a binding vote.");
}
