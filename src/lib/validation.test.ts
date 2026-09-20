import { describe, expect, it } from "vitest";
import { experimentSchema, signupSchema } from "./validation";

describe("boundary validation", () => {
  it("normalizes citizen email and rejects weak passwords", () => {
    const valid = signupSchema.parse({ displayName: "Ada", email: "ADA@EXAMPLE.COM", password: "long-enough-password" });
    expect(valid.email).toBe("ada@example.com");
    expect(signupSchema.safeParse({ displayName: "Ada", email: "ada@example.com", password: "short" }).success).toBe(false);
  });

  it("constructs metric and guardrail arrays at the request boundary", () => {
    const result = experimentSchema.parse({
      ideaId: "idea_123", title: "A useful experiment", question: "Will the changed environment improve the outcome?",
      hypothesis: "Changing the environment will improve a measured human outcome.",
      description: "A small and explicit experiment description.", intervention: "Participants receive a visible and reversible environmental change.",
      participantTarget: "20", participantEligibility: "Adults who knowingly choose to participate", durationDays: "14",
      primaryMetric: "Minutes per week", secondaryMetrics: "Enjoyment, retention", guardrails: "Stress, privacy",
      baseline: "80 minutes per week", dataCollected: "Aggregate minutes and an optional enjoyment rating.",
      privacyNotes: "Only aggregate results are public and individual data remains private.", timeBurden: "Ten minutes per day",
    });
    expect(result.secondaryMetrics).toEqual(["Enjoyment", "retention"]);
    expect(result.guardrails).toEqual(["Stress", "privacy"]);
    expect(result.durationDays).toBe(14);
  });
});
