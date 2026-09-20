import Link from "next/link";
import { currentCitizen } from "@/lib/auth";
import { Logo } from "./logo";
export async function SiteHeader() {
  let citizen = null;
  try { citizen = await currentCitizen(); } catch { /* Keep public pages available during database maintenance. */ }
  return <header className="border-b hairline bg-[rgb(241_238_230/.9)] backdrop-blur-md"><div className="shell flex min-h-16 items-center justify-between gap-6"><Logo /><nav className="desktop-nav flex items-center gap-6 text-[.78rem] font-bold" aria-label="Primary navigation"><Link href="/about" className="no-underline hover:text-[var(--oxide)]">About</Link><Link href="/method" className="no-underline hover:text-[var(--oxide)]">Method</Link><Link href="/principles" className="no-underline hover:text-[var(--oxide)]">Principles</Link><Link href="/experiments" className="no-underline hover:text-[var(--oxide)]">Experiments</Link></nav><div className="flex items-center gap-2">{citizen ? <Link href="/app" className="btn btn-primary">Open lab <span aria-hidden>↗</span></Link> : <><Link href="/login" className="desktop-nav text-[.78rem] font-bold no-underline">Sign in</Link><Link href="/join" className="btn btn-primary">Join</Link></>}</div></div></header>;
}
