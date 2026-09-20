import Link from "next/link";
import { redirect } from "next/navigation";
import { currentCitizen } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const citizen = await currentCitizen(); if (!citizen) redirect("/login?returnTo=/app");
  return <><div className="border-b border-[var(--line)] bg-[var(--paper)]"><div className="shell flex min-h-14 items-center justify-between gap-4"><nav className="flex items-center gap-5 overflow-x-auto text-xs font-bold" aria-label="Lab navigation"><Link href="/app" className="no-underline">Lab</Link><Link href="/app/create?tab=goal" className="no-underline">Create goal</Link><Link href="/app/create?tab=idea" className="no-underline">Propose idea</Link><Link href="/app/create?tab=experiment" className="no-underline">Propose experiment</Link></nav><form action="/api/auth/logout" method="post"><button type="submit" className="whitespace-nowrap border-0 bg-transparent text-xs font-bold underline">Sign out</button></form></div></div>{children}</>;
}
