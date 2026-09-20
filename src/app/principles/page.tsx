import type { Metadata } from "next";
import { loadPrinciples } from "@/lib/knowledge";

export const metadata: Metadata = { title: "Principles" };
export default async function PrinciplesPage() {
  const principles = await loadPrinciples();
  return <div className="shell py-20"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Constitutional layer</p><h1 className="serif mt-5 text-6xl font-bold tracking-[-.055em]">Influence demands safeguards.</h1></div><p className="self-end text-xl leading-9 text-[var(--muted)]">Design the environment to empower people, not to control them. Every experiment, feature, and governance mechanism is constrained by these principles.</p></div><ol className="mt-16 grid list-none gap-px border hairline bg-[var(--line)] p-0 md:grid-cols-2">{principles.map((principle, index) => <li key={principle.id} className="min-h-56 bg-[var(--paper)] p-7 sm:p-9"><span className="eyebrow">Principle {String(index + 1).padStart(2, "0")}</span><h2 className="serif mt-7 text-3xl font-bold tracking-[-.03em]">{principle.title}</h2><p className="mt-4 leading-7 text-[var(--muted)]">{principle.description}</p></li>)}</ol><div className="mt-14 border border-[var(--line)] bg-[var(--acid)] p-7 text-center"><strong className="serif text-2xl">Principles can evolve—but never silently.</strong><p className="mt-2 text-sm">This page renders the canonical OKF principle records. Material changes require review, a versioned record, and an explanation of what was learned.</p></div></div>;
}
