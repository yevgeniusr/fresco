import { z } from "zod";

const trimmed = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum);

export const signupSchema = z.object({
  displayName: trimmed(2, 60),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(10).max(128),
});

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const goalSchema = z.object({
  title: trimmed(5, 120),
  description: trimmed(20, 1000),
  domain: z.enum(["Health", "Learning", "Social", "Contribution", "Governance"]),
  targetMetric: trimmed(3, 160),
  baseline: trimmed(1, 120),
  desiredTarget: trimmed(1, 120),
  reasoning: trimmed(20, 1000),
});

export const ideaSchema = z.object({
  goalId: trimmed(3, 100),
  title: trimmed(5, 120),
  explanation: trimmed(20, 1500),
  hypothesis: trimmed(20, 800),
  expectedEffect: trimmed(5, 500),
  estimatedCost: trimmed(1, 120),
  potentialDownsides: trimmed(10, 800),
});

export const experimentSchema = z.object({
  ideaId: trimmed(3, 100),
  title: trimmed(5, 120),
  question: trimmed(10, 500),
  hypothesis: trimmed(20, 800),
  description: trimmed(20, 1500),
  intervention: trimmed(20, 1500),
  participantTarget: z.coerce.number().int().min(2).max(10000),
  participantEligibility: trimmed(5, 600),
  durationDays: z.coerce.number().int().min(1).max(365),
  primaryMetric: trimmed(3, 240),
  secondaryMetrics: trimmed(1, 800).transform(csv),
  guardrails: trimmed(1, 800).transform(csv),
  baseline: trimmed(1, 300),
  dataCollected: trimmed(10, 800),
  privacyNotes: trimmed(10, 800),
  timeBurden: trimmed(3, 240),
});

export const commentSchema = z.object({ body: trimmed(2, 2000) });
export const signalSchema = z.object({
  outcome: z.enum(["Scale", "Modify", "Repeat", "Stop", "Inconclusive"]),
  reasoning: z.string().trim().max(1000).default(""),
});

function csv(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function formObject(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    [...formData.entries()].flatMap(([key, value]) => (typeof value === "string" ? [[key, value]] : [])),
  );
}
