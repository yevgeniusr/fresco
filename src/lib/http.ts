import { NextResponse } from "next/server";

export function redirectWith(request: Request, path: string, key: "error" | "success", message: string) {
  const url = new URL(path, request.url);
  url.searchParams.set(key, message);
  return NextResponse.redirect(url, 303);
}

export function safeReturnTo(value: FormDataEntryValue | null, fallback: string): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
