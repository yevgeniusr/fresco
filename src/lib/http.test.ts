import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, safeReturnTo } from "./http";

afterEach(() => vi.unstubAllEnvs());

describe("redirect origins", () => {
  it("uses the configured public origin behind a reverse proxy", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://fresco.example");
    const request = new Request("http://localhost:3000/api/auth/signup");
    expect(absoluteUrl(request, "/app?welcome=1").href).toBe("https://fresco.example/app?welcome=1");
  });

  it("accepts only same-origin relative return paths", () => {
    expect(safeReturnTo("/app/experiments/one", "/app")).toBe("/app/experiments/one");
    expect(safeReturnTo("//malicious.example", "/app")).toBe("/app");
    expect(safeReturnTo("https://malicious.example", "/app")).toBe("/app");
  });
});
