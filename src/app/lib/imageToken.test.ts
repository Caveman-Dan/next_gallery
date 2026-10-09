import { afterEach, describe, expect, it, vi } from "vitest";
import { signImagePath, signedImageSrc } from "./imageToken";

describe("imageToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("throws when IMAGE_SIGNING_SECRET is unset", () => {
    vi.stubEnv("IMAGE_SIGNING_SECRET", "");
    expect(() => signImagePath("travel/rome.jpg")).toThrow("IMAGE_SIGNING_SECRET is not set");
  });

  it("signs the same path and clock to the same HMAC (Hash-based Message Authentication Code)", () => {
    vi.stubEnv("IMAGE_SIGNING_SECRET", "test-secret");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T12:00:00Z"));
    const first = signImagePath("travel/rome.jpg");
    const second = signImagePath("travel/rome.jpg");
    expect(second).toEqual(first);
    expect(first.expires).toBe(Math.floor(Date.now() / 1000) + 600);
    expect(signImagePath("travel/venice.jpg").signature).not.toBe(first.signature);
  });

  it("changes the signature when the secret changes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T12:00:00Z"));
    vi.stubEnv("IMAGE_SIGNING_SECRET", "one");
    const first = signImagePath("travel/rome.jpg").signature;
    vi.stubEnv("IMAGE_SIGNING_SECRET", "two");
    expect(signImagePath("travel/rome.jpg").signature).not.toBe(first);
  });

  it("builds a src from NEXT_PUBLIC_API_GET_IMAGE, then API_GET_IMAGE, then the default", () => {
    vi.stubEnv("IMAGE_SIGNING_SECRET", "test-secret");
    vi.stubEnv("NEXT_PUBLIC_API_GET_IMAGE", "/public-image");
    vi.stubEnv("API_GET_IMAGE", "/server-image");
    expect(signedImageSrc("travel/rome.jpg")).toMatch(/^\/public-image\/travel\/rome\.jpg\?exp=\d+&sig=[a-f0-9]+$/);

    delete process.env.NEXT_PUBLIC_API_GET_IMAGE;
    expect(signedImageSrc("travel/rome.jpg")).toMatch(/^\/server-image\/travel\/rome\.jpg\?/);

    delete process.env.API_GET_IMAGE;
    expect(signedImageSrc("travel/rome.jpg")).toMatch(/^\/api\/get_image\/travel\/rome\.jpg\?/);
  });

  it("encodes each path segment", () => {
    vi.stubEnv("IMAGE_SIGNING_SECRET", "test-secret");
    vi.stubEnv("NEXT_PUBLIC_API_GET_IMAGE", "/api/get_image");
    expect(signedImageSrc("travel/my photo#1.jpg")).toContain("/travel/my%20photo%231.jpg?exp=");
  });
});
