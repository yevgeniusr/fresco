import { describe, expect, it } from "vitest";
import { newId, slugify } from "./ids";

describe("ids", () => {
  it("creates prefixed unique ids", () => {
    const first = newId("exp");
    const second = newId("exp");
    expect(first).toMatch(/^exp_/);
    expect(first).not.toBe(second);
  });

  it("creates URL-safe slugs", () => {
    expect(slugify("  Better Environments: Trial #1 ")).toBe("better-environments-trial-1");
  });
});
