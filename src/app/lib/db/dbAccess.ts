import { cache } from "react";
import { dbQuery } from "@/lib/db/db";
import { getSession, type SessionUser } from "@/lib/db/dbSession";

export type Principal =
  | { kind: "guest"; user: null }
  | { kind: "pending"; user: SessionUser }
  | { kind: "user"; user: SessionUser }
  | { kind: "admin"; user: SessionUser };

export type AlbumAccess = { all: true } | { all: false; paths: string[] };

export const getPrincipal = cache(async (): Promise<Principal> => {
  const session = await getSession();
  if (!session || session.status === "disabled") {
    return { kind: "guest", user: null };
  }
  if (session.role === "admin") {
    return { kind: "admin", user: session };
  }
  if (session.status === "pending") {
    return { kind: "pending", user: session };
  }
  return { kind: "user", user: session };
});

const publicAlbumPaths = async () => {
  const rows = await dbQuery<{ album_path: string }[]>(
    `SELECT DISTINCT apa.album_path
     FROM __PREFIX__access_profile_albums apa
     INNER JOIN __PREFIX__access_profiles ap ON ap.id = apa.access_profile_id
     WHERE ap.public = 1`
  );
  return rows.map((row) => row.album_path);
};

const userAlbumPaths = async (userId: number) => {
  const rows = await dbQuery<{ album_path: string }[]>(
    `SELECT DISTINCT apa.album_path
     FROM __PREFIX__access_profile_albums apa
     INNER JOIN __PREFIX__user_access_profiles uap ON uap.access_profile_id = apa.access_profile_id
     WHERE uap.user_id = ?`,
    [userId]
  );
  return rows.map((row) => row.album_path);
};

export const getAllowedAlbumPaths = async (): Promise<AlbumAccess> => {
  const principal = await getPrincipal();

  if (principal.kind === "admin") {
    return { all: true };
  }

  const publicPaths = await publicAlbumPaths();

  if (principal.kind === "user") {
    const extra = await userAlbumPaths(principal.user.userId);
    return { all: false, paths: [...new Set([...publicPaths, ...extra])] };
  }

  return { all: false, paths: publicPaths };
};
