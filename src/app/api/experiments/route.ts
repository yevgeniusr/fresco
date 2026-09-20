import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { experiments } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { absoluteUrl, redirectWith } from "@/lib/http";
import { newId, slugify } from "@/lib/ids";
import { experimentSchema, formObject } from "@/lib/validation";

export async function POST(request: Request) {
  const citizen = await currentCitizen();
  if (!citizen) return NextResponse.redirect(absoluteUrl(request, "/login?returnTo=/app/create"), 303);
  const parsed = experimentSchema.safeParse(formObject(await request.formData()));
  if (!parsed.success) return redirectWith(request, "/app/create?tab=experiment", "error", parsed.error.issues[0]?.message ?? "Check the experiment.");
  const id = newId("exp");
  const slug = `${slugify(parsed.data.title)}-${id.slice(-6)}`;
  await db.insert(experiments).values({ id, slug, creatorId: citizen.id, status: "Draft", ...parsed.data });
  revalidatePath("/app");
  return NextResponse.redirect(absoluteUrl(request, `/app/experiments/${slug}?created=1`), 303);
}
