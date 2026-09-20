import Link from "next/link";
export function Logo() {
  return <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Fresco home"><span className="relative block h-7 w-7 rounded-full border border-[var(--ink)]"><span className="absolute left-[5px] top-[5px] h-2.5 w-2.5 rounded-full bg-[var(--oxide)]" /><span className="absolute bottom-[4px] right-[4px] h-2 w-3 rounded-[50%] bg-[var(--indigo)]" /></span><span className="serif text-[1.45rem] font-bold tracking-[-.04em]">Fresco</span><span className="hidden border-l border-[var(--line)] pl-2 text-[.62rem] font-bold uppercase tracking-[.12em] text-[var(--muted)] sm:block">v0.1</span></Link>;
}
