import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { experiments, participations } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { absoluteUrl, redirectWith } from "@/lib/http";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const citizen = await currentCitizen();
  const { id } = await context.params;
  if (!citizen) return NextResponse.redirect(absoluteUrl(request, `/login?returnTo=/experiments/${id}`), 303);
  const [experiment] = await db.select({ id: experiments.id, status: experiments.status }).from(experiments).where(eq(experiments.id, id)).limit(1);
  if (!experiment || experiment.status !== "Recruiting") return redirectWith(request, `/experiments/${id}`, "error", "This experiment is not recruiting.");
  await db.insert(participations).values({ experimentId: id, citizenId: citizen.id, withdrawnAt: null }).onConflictDoUpdate({
    target: [participations.experimentId, participations.citizenId],
    set: { withdrawnAt: null, consentedAt: new Date(), consentVersion: "v0.1" },
  });
  revalidatePath(`/experiments/${id}`); revalidatePath(`/app/experiments/${id}`); revalidatePath("/app");
  return redirectWith(request, `/app/experiments/${id}`, "success", "You joined voluntarily. You can withdraw at any time.");
}
