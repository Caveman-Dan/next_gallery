import { describe, expect, it } from "vitest";
import { checkValidEmail } from "./validatorHelpers";

describe("checkValidEmail", () => {
  it("accepts a normal address and a trimmed one", () => {
    expect(checkValidEmail("bob@bob.com")).toBe(true);
    expect(checkValidEmail("  bob@bob.com  ")).toBe(true);
  });

  it("treats an empty string as allowed, so a missing email can use another validator", () => {
    expect(checkValidEmail("")).toBe(true);
    expect(checkValidEmail("   ")).toBe(true);
  });

  it("rejects a non-string", () => {
    expect(checkValidEmail(undefined as unknown as string)).toBe(false);
  });

  it("rejects an address with no at-sign, no domain, or an internal space", () => {
    expect(checkValidEmail("bob")).toBe(false);
    expect(checkValidEmail("bob@")).toBe(false);
    expect(checkValidEmail("bob @bob.com")).toBe(false);
  });
});
