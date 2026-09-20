import { NextResponse } from "next/server";

import { destroySession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/http";

export async function POST(request: Request) {
  await destroySession();
  return NextResponse.redirect(absoluteUrl(request, "/"), 303);
}
