import type { Metadata } from "next";
import { ExperimentCard } from "@/components/experiment-card";
import { listPublicExperiments } from "@/lib/queries";
export const metadata: Metadata = { title: "Experiments" };
export const dynamic = "force-dynamic";
export default async function ExperimentsPage() {
  const experiments = await listPublicExperiments();
  return <div className="shell py-20"><div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">Public experiment catalogue</p><h1 className="serif mt-5 text-6xl font-bold tracking-[-.055em]">Inspect the question, not just the outcome.</h1></div><p className="text-lg leading-8 text-[var(--muted)]">Completed results, limitations, guardrails, and decisions remain visible without an account. Seed content is marked as illustrative.</p></div><div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{experiments.map(experiment => <ExperimentCard key={experiment.id} experiment={experiment} />)}</div></div>;
}
