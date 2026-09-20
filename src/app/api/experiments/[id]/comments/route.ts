import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { currentCitizen } from "@/lib/auth";
import { redirectWith } from "@/lib/http";
import { newId } from "@/lib/ids";
import { commentSchema, formObject } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const citizen = await currentCitizen(); const { id } = await context.params;
  if (!citizen) return NextResponse.redirect(new URL(`/login?returnTo=/app/experiments/${id}`, request.url), 303);
  const parsed = commentSchema.safeParse(formObject(await request.formData()));
  if (!parsed.success) return redirectWith(request, `/app/experiments/${id}`, "error", "Write between 2 and 2,000 characters.");
  await db.insert(comments).values({ id: newId("com"), experimentId: id, citizenId: citizen.id, body: parsed.data.body });
  revalidatePath(`/app/experiments/${id}`);
  return redirectWith(request, `/app/experiments/${id}`, "success", "Your question or criticism was added.");
}
