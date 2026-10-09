import { describe, expect, it } from "vitest";
import { hashPassword, passwordNeedsRehash, verifyPassword } from "./password";

describe("password", () => {
  it("verifies the password that was hashed and rejects a different one", async () => {
    const stored = await hashPassword("correct horse");
    expect(await verifyPassword("correct horse", stored)).toBe(true);
    expect(await verifyPassword("wrong", stored)).toBe(false);
  });

  it("returns false for a garbage hash instead of throwing", async () => {
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
  });

  it("does not need a rehash for a hash just produced with the current options", async () => {
    expect(passwordNeedsRehash(await hashPassword("correct horse"))).toBe(false);
  });
});
