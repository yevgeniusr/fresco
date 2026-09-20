import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { ideas } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { redirectWith } from "@/lib/http";
import { newId } from "@/lib/ids";
import { formObject, ideaSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const citizen = await currentCitizen();
  if (!citizen) return NextResponse.redirect(new URL("/login?returnTo=/app/create", request.url), 303);
  const parsed = ideaSchema.safeParse(formObject(await request.formData()));
  if (!parsed.success) return redirectWith(request, "/app/create?tab=idea", "error", parsed.error.issues[0]?.message ?? "Check the idea.");
  await db.insert(ideas).values({ id: newId("idea"), creatorId: citizen.id, ...parsed.data });
  revalidatePath("/app");
  return NextResponse.redirect(new URL(`/app/goals/${parsed.data.goalId}?idea=created`, request.url), 303);
}
