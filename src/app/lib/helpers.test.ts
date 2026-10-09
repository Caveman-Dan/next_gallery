import { afterEach, describe, expect, it, vi } from "vitest";
import { apiError, capitalise, cropPath, isApiErrorResponse, isGalleryCacheTag, joinPath, randomInt } from "./helpers";

describe("helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds and recognises an API error", () => {
    expect(apiError(404, "missing")).toEqual({ error: true, status: 404, message: "missing" });
    expect(isApiErrorResponse(apiError(500, "x"))).toBe(true);
    expect(isApiErrorResponse(null)).toBe(false);
    expect(isApiErrorResponse([])).toBe(false);
    expect(isApiErrorResponse({ error: false })).toBe(false);
  });

  it("matches exact gallery tags and prefix tags", () => {
    expect(isGalleryCacheTag("galleryData")).toBe(true);
    expect(isGalleryCacheTag("galleryData:travel")).toBe(true);
    expect(isGalleryCacheTag("album:home")).toBe(true);
    expect(isGalleryCacheTag("albums")).toBe(true);
    expect(isGalleryCacheTag("other")).toBe(false);
  });

  it("capitalises only the first character", () => {
    expect(capitalise("travel")).toBe("Travel");
  });

  it("crops a decoded path to the given depth", () => {
    expect(cropPath("travel/my%20rome/photo.jpg", 2)).toBe("travel/my rome");
  });

  it("joins parts and drops empty slashes", () => {
    expect(joinPath("/travel/", "", "rome/")).toBe("travel/rome");
  });

  it("keeps randomInt inside the inclusive range", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomInt(6)).toBe(1);
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    expect(randomInt(2, 4)).toBe(4);
  });
});
