import Link from "next/link";
import { Logo } from "./logo";
export function SiteFooter() {
  return <footer className="mt-24 border-t hairline bg-[var(--ink)] py-12 text-white"><div className="shell grid gap-10 md:grid-cols-[1fr_auto] md:items-end"><div><Logo /><p className="mt-5 max-w-xl text-sm leading-6 text-white/65">A continuous environmental design system for human life. Open, experimental, and unaffiliated with The Venus Project or related organizations.</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold" aria-label="Footer navigation"><Link href="/method">Method</Link><Link href="/principles">Principles</Link><Link href="/research">Research</Link><Link href="/github">Source</Link></nav></div></footer>;
}
