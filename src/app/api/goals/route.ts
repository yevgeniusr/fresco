import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { goals } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { absoluteUrl, redirectWith } from "@/lib/http";
import { newId, slugify } from "@/lib/ids";
import { formObject, goalSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const citizen = await currentCitizen();
  if (!citizen) return NextResponse.redirect(absoluteUrl(request, "/login?returnTo=/app/create"), 303);
  const parsed = goalSchema.safeParse(formObject(await request.formData()));
  if (!parsed.success) return redirectWith(request, "/app/create?tab=goal", "error", parsed.error.issues[0]?.message ?? "Check the goal.");
  const id = newId("goal");
  const slug = `${slugify(parsed.data.title)}-${id.slice(-6)}`;
  await db.insert(goals).values({ id, slug, creatorId: citizen.id, ...parsed.data });
  revalidatePath("/app");
  return NextResponse.redirect(absoluteUrl(request, `/app/goals/${slug}?created=1`), 303);
}
