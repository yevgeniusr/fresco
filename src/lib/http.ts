import { NextResponse } from "next/server";

export function redirectWith(request: Request, path: string, key: "error" | "success", message: string) {
  const url = absoluteUrl(request, path);
  url.searchParams.set(key, message);
  return NextResponse.redirect(url, 303);
}

export function absoluteUrl(request: Request, path: string): URL {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredOrigin) return new URL(path, configuredOrigin);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto") ?? "https";
  return new URL(path, forwardedHost ? `${forwardedProtocol}://${forwardedHost}` : request.url);
}

export function safeReturnTo(value: FormDataEntryValue | null, fallback: string): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
