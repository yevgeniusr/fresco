import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("verifies the original password but not a different one", async () => {
    const encoded = await hashPassword("a sufficiently long passphrase");
    expect(encoded).not.toContain("a sufficiently long passphrase");
    await expect(verifyPassword("a sufficiently long passphrase", encoded)).resolves.toBe(true);
    await expect(verifyPassword("a different passphrase", encoded)).resolves.toBe(false);
  });

  it("rejects malformed stored hashes", async () => {
    await expect(verifyPassword("password", "not-a-hash")).resolves.toBe(false);
  });
});
