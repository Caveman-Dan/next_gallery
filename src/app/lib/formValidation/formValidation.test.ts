import { describe, expect, it, vi } from "vitest";
import { validateForm } from "./formValidation";
import type { FormConfig } from "@/definitions/formDefinitions";

const baseConfig = (): FormConfig => ({
  config: {
    initialState: {
      email: { value: "", errors: false, messages: [] },
    },
  },
  fields: {
    email: {
      tests: [
        { test: (value) => ({ value, error: false, message: "" }), options: { errorMessage: "empty" } },
        { test: () => ({ value: "kept", error: true, message: "bad" }), options: { errorMessage: "bad" } },
        { test: () => ({ value: "later", error: true, message: "skipped" }), options: { errorMessage: "skipped" } },
      ],
    },
  },
});

describe("validateForm", () => {
  it("stops at the first error and does not mutate the config", async () => {
    const formConfig = baseConfig();
    const state = await validateForm({ email: "bob@bob.com" }, formConfig);
    expect(state.email).toEqual({ value: "kept", errors: true, messages: ["bad"] });
    expect(formConfig.config.initialState.email.messages).toEqual([]);
  });

  it("leaves errors false when every test passes", async () => {
    const formConfig = baseConfig();
    formConfig.fields.email.tests = [
      { test: (value) => ({ value, error: false, message: "" }), options: { errorMessage: "empty" } },
    ];
    const state = await validateForm({ email: "bob@bob.com" }, formConfig);
    expect(state.email.errors).toBe(false);
    expect(state.email.messages).toEqual([]);
  });

  it("throws when a submitted field is not configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const formConfig = baseConfig();
    await expect(validateForm({ missing: "x" }, formConfig)).rejects.toThrow('Form field "missing" is not configured');
  });
});
