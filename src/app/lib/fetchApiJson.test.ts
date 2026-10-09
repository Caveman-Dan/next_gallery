import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchApiJson } from "./fetchApiJson";

const url = new URL("http://gallery.test/albums");

describe("fetchApiJson", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("throws when API is unset", async () => {
    vi.stubEnv("API", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchApiJson(url, "API is not set")).rejects.toThrow("API is not set");
  });

  it("returns the payload message from a failed response", async () => {
    vi.stubEnv("API", "http://gallery.test");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ message: "nope" }), { status: 404 }))
    );
    expect(await fetchApiJson(url, "missing")).toEqual({ error: true, status: 404, message: "nope" });
  });

  it("uses a status fallback when the error body has no message", async () => {
    vi.stubEnv("API", "http://gallery.test");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 }))
    );
    expect(await fetchApiJson(url, "missing")).toEqual({ error: true, status: 500, message: "Request failed (500)" });
  });

  it("returns 502 when the body is not JSON", async () => {
    vi.stubEnv("API", "http://gallery.test");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("ok", { status: 200 }))
    );
    expect(await fetchApiJson(url, "missing")).toEqual({
      error: true,
      status: 502,
      message: "API returned a non-JSON response",
    });
  });

  it("returns 504 on a timeout and 503 on any other fetch failure", async () => {
    vi.stubEnv("API", "http://gallery.test");
    const timeout = new Error("timed out");
    timeout.name = "TimeoutError";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(timeout))
    );
    expect(await fetchApiJson(url, "missing")).toEqual({
      error: true,
      status: 504,
      message: "The gallery API timed out",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("down")))
    );
    expect(await fetchApiJson(url, "missing")).toEqual({
      error: true,
      status: 503,
      message: "Could not reach the gallery API",
    });
  });

  it("returns parsed JSON on success", async () => {
    vi.stubEnv("API", "http://gallery.test");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ name: "travel" }), { status: 200 }))
    );
    expect(await fetchApiJson<{ name: string }>(url, "missing")).toEqual({ name: "travel" });
  });
});
