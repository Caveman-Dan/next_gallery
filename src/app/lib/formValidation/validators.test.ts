import { describe, expect, it } from "vitest";
import { isFieldEmpty, isMatchingPassword, isValidEmail } from "./validators";

const options = { errorMessage: "nope" };

describe("isFieldEmpty", () => {
  it("errors on an empty string and uses the options message", () => {
    expect(isFieldEmpty("", options)).toEqual({ value: "", error: true, message: "nope" });
  });

  it("accepts a non-empty string", () => {
    expect(isFieldEmpty("x", options)).toEqual({ value: "x", error: false, message: "" });
  });
});

describe("isValidEmail", () => {
  it("accepts an empty string, matching checkValidEmail", () => {
    expect(isValidEmail("", options).error).toBe(false);
  });

  it("rejects a malformed address", () => {
    expect(isValidEmail("not-an-email", options)).toEqual({ value: "not-an-email", error: true, message: "nope" });
  });
});

describe("isMatchingPassword", () => {
  it("errors when the value does not match newPassword", () => {
    expect(isMatchingPassword("a", options, { newPassword: "b" })).toEqual({
      value: "a",
      error: true,
      message: "nope",
    });
  });

  it("accepts a match", () => {
    expect(isMatchingPassword("same", options, { newPassword: "same" }).error).toBe(false);
  });
});
