import { afterEach, describe, expect, it, vi } from "vitest";
import { handleClientError, handleServerError } from "./errorHandling";

describe("errorHandling", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs and throws from the server handler", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => handleServerError({ message: "boom" })).toThrow("boom");
  });

  it("logs and does not throw from the client handler", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => handleClientError({ message: "boom" })).not.toThrow();
  });
});
