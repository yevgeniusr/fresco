import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentCitizen } from "@/lib/auth";
export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; returnTo?: string }> }) {
  if (await currentCitizen()) redirect("/app"); const query = await searchParams;
  return <div className="shell grid min-h-[70vh] place-items-center py-16"><form className="paper w-full max-w-md p-7 sm:p-10" action="/api/auth/login" method="post"><p className="eyebrow">Citizen access</p><h1 className="serif mt-4 text-4xl font-bold">Return to the lab</h1>{query.error ? <p className="alert mt-5 text-sm">{query.error}</p> : null}<input type="hidden" name="returnTo" value={query.returnTo ?? "/app"} /><div className="mt-7 grid gap-5"><div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" required autoComplete="email" /></div><div className="field"><label htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" required autoComplete="current-password" /></div></div><button className="btn btn-primary mt-7 w-full" type="submit">Sign in</button><p className="mt-5 text-center text-xs text-[var(--muted)]">New here? <Link href="/join" className="font-bold text-[var(--ink)]">Become a citizen</Link></p></form></div>;
}
