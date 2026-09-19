import type { AccessProfileOption } from "@/lib/db/dbUsers";

export const syncKnownProfiles = (
  knownProfiles: AccessProfileOption[],
  profiles: AccessProfileOption[],
  leaving: AccessProfileOption[]
) => {
  const justRemoved = knownProfiles.filter((profile) => !profiles.some((item) => item.id === profile.id));
  if (justRemoved.length) {
    return {
      knownProfiles: profiles,
      leaving: [...leaving, ...justRemoved.filter((profile) => !leaving.some((item) => item.id === profile.id))],
    };
  }
  if (knownProfiles.length !== profiles.length) {
    return { knownProfiles: profiles, leaving };
  }
  return null;
};

export const visiblePrivilegeProfiles = (profiles: AccessProfileOption[], leaving: AccessProfileOption[]) => [
  ...profiles,
  ...leaving.filter((profile) => !profiles.some((item) => item.id === profile.id)),
];
