import { describe, expect, it } from "vitest";
import { initialFormState, inputInitialState, readFormValues } from "./formHelpers";

describe("initialFormState", () => {
  it("gives each field a fresh copy of the empty input state", () => {
    const state = initialFormState({ email: {}, password: {} });
    expect(state.email).toEqual(inputInitialState);
    expect(state.password).toEqual(inputInitialState);
    expect(state.email).not.toBe(state.password);
  });
});

describe("readFormValues", () => {
  const formConfig = { config: { initialState: {} }, fields: { email: {}, password: {} } };

  it("reads configured fields and ignores anything else", () => {
    const formData = new FormData();
    formData.set("email", "a@b.co");
    formData.set("extra", "nope");
    expect(readFormValues(formData, formConfig)).toEqual({ email: "a@b.co", password: "" });
  });

  it("returns empty strings when form data is missing", () => {
    expect(readFormValues(undefined, formConfig)).toEqual({ email: "", password: "" });
  });
});
