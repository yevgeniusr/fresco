import { notFound } from "next/navigation";
import { ExperimentDetail } from "@/components/experiment-detail";
import { currentCitizen } from "@/lib/auth";
import { getExperiment } from "@/lib/queries";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; success?: string }> };
export default async function AppExperimentPage({ params, searchParams }: Props) {
  const citizen = await currentCitizen(); if (!citizen) return null; const data = await getExperiment((await params).id, citizen.id); if (!data) notFound();
  const query = await searchParams; const message = query.error ? { kind: "error" as const, text: query.error } : query.success ? { kind: "success" as const, text: query.success } : null;
  return <ExperimentDetail data={data} authenticated appMode message={message} />;
}
