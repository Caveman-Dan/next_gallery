import { describe, expect, it } from "vitest";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import { syncKnownProfiles, visiblePrivilegeProfiles } from "./privilegesList";

const profile = (id: number, name = `p${id}`): AccessProfileOption => ({
  id,
  name,
  isPublic: false,
  albumPaths: [],
});

describe("syncKnownProfiles", () => {
  it("returns null when nothing changed", () => {
    const profiles = [profile(1)];
    expect(syncKnownProfiles(profiles, profiles, [])).toBeNull();
  });

  it("moves a removed profile into leaving and updates the known list", () => {
    const removed = profile(2);
    const next = syncKnownProfiles([profile(1), removed], [profile(1)], []);
    expect(next).toEqual({ knownProfiles: [profile(1)], leaving: [removed] });
  });

  it("does not add a removed profile that is already leaving", () => {
    const removed = profile(2);
    const next = syncKnownProfiles([profile(1), removed], [profile(1)], [removed]);
    expect(next?.leaving).toEqual([removed]);
  });

  it("updates the known list when a profile is added, and does not touch leaving", () => {
    const leaving = [profile(9)];
    expect(syncKnownProfiles([profile(1)], [profile(1), profile(2)], leaving)).toEqual({
      knownProfiles: [profile(1), profile(2)],
      leaving,
    });
  });
});

describe("visiblePrivilegeProfiles", () => {
  it("appends leaving profiles that are no longer current", () => {
    expect(visiblePrivilegeProfiles([profile(1)], [profile(2)]).map((item) => item.id)).toEqual([1, 2]);
  });

  it("does not duplicate a profile that is both current and leaving", () => {
    expect(visiblePrivilegeProfiles([profile(1)], [profile(1)]).map((item) => item.id)).toEqual([1]);
  });
});
