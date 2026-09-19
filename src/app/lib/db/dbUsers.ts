import { dbQuery } from "@/lib/db/db";

export type AdminUserListItem = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  status: "pending" | "active" | "disabled";
  profileIds: number[];
};

export type AccessProfileOption = {
  id: number;
  name: string;
  isPublic: boolean;
  albumPaths: string[];
};

export const listAdminUsers = async () => {
  const users = await dbQuery<
    {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      role: "admin" | "user";
      status: "pending" | "active" | "disabled";
    }[]
  >(
    `SELECT id, email, first_name, last_name, role, status
     FROM __PREFIX__users
     ORDER BY first_name ASC, last_name ASC, id ASC`
  );

  const grants = await dbQuery<{ user_id: number; access_profile_id: number }[]>(
    `SELECT user_id, access_profile_id FROM __PREFIX__user_access_profiles`
  );

  const profileIdsByUser = new Map<number, number[]>();
  for (const grant of grants) {
    const list = profileIdsByUser.get(grant.user_id) ?? [];
    list.push(grant.access_profile_id);
    profileIdsByUser.set(grant.user_id, list);
  }

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    status: user.status,
    profileIds: profileIdsByUser.get(user.id) ?? [],
  })) satisfies AdminUserListItem[];
};

export const listAccessProfiles = async () => {
  const rows = await dbQuery<{ id: number; name: string; public: number }[]>(
    `SELECT id, name, public FROM __PREFIX__access_profiles ORDER BY name ASC`
  );
  const albums = await dbQuery<{ access_profile_id: number; album_path: string }[]>(
    `SELECT access_profile_id, album_path FROM __PREFIX__access_profile_albums`
  );
  const albumsByProfile = new Map<number, string[]>();
  for (const row of albums) {
    const list = albumsByProfile.get(row.access_profile_id) ?? [];
    list.push(row.album_path);
    albumsByProfile.set(row.access_profile_id, list);
  }
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    isPublic: Boolean(row.public),
    albumPaths: albumsByProfile.get(row.id) ?? [],
  })) satisfies AccessProfileOption[];
};

export const setProfilePublic = async (accessProfileId: number, isPublic: boolean) => {
  await dbQuery(`UPDATE __PREFIX__access_profiles SET public = ? WHERE id = ?`, [isPublic ? 1 : 0, accessProfileId]);
};

export const nextUnnamedProfileName = async () => {
  const rows = await dbQuery<{ name: string }[]>(`SELECT name FROM __PREFIX__access_profiles`);
  const used = new Set(rows.map((row) => row.name.toLowerCase()));
  let n = 1;
  while (used.has(`un-named ${String(n).padStart(2, "0")}`)) n += 1;
  return `un-named ${String(n).padStart(2, "0")}`;
};

export const createAccessProfile = async (name: string) => {
  const result = await dbQuery<{ insertId: number }>(
    `INSERT INTO __PREFIX__access_profiles (name, public) VALUES (?, 0)`,
    [name]
  );
  return Number(result.insertId);
};

export const deleteAccessProfile = async (accessProfileId: number) => {
  const rows = await dbQuery<{ public: number }[]>(`SELECT public FROM __PREFIX__access_profiles WHERE id = ?`, [
    accessProfileId,
  ]);
  if (!rows[0] || rows[0].public) return;
  await dbQuery(`DELETE FROM __PREFIX__access_profiles WHERE id = ? AND public = 0`, [accessProfileId]);
};

export const renameAccessProfile = async (accessProfileId: number, name: string) => {
  const rows = await dbQuery<{ public: number }[]>(`SELECT public FROM __PREFIX__access_profiles WHERE id = ?`, [
    accessProfileId,
  ]);
  if (!rows[0] || rows[0].public) return;
  await dbQuery(`UPDATE __PREFIX__access_profiles SET name = ? WHERE id = ? AND public = 0`, [name, accessProfileId]);
};

export const setProfileAlbums = async (accessProfileId: number, albumPaths: string[]) => {
  await dbQuery(`DELETE FROM __PREFIX__access_profile_albums WHERE access_profile_id = ?`, [accessProfileId]);
  for (const albumPath of albumPaths) {
    await dbQuery(`INSERT INTO __PREFIX__access_profile_albums (access_profile_id, album_path) VALUES (?, ?)`, [
      accessProfileId,
      albumPath,
    ]);
  }
};

export const addProfileAlbum = async (accessProfileId: number, albumPath: string) => {
  await dbQuery(
    `INSERT INTO __PREFIX__access_profile_albums (access_profile_id, album_path)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE album_path = album_path`,
    [accessProfileId, albumPath]
  );
  // Parent grant covers descendants — drop redundant child rows
  await dbQuery(
    `DELETE FROM __PREFIX__access_profile_albums
     WHERE access_profile_id = ?
       AND album_path LIKE ?`,
    [accessProfileId, `${albumPath}/%`]
  );
};

export const removeProfileAlbum = async (accessProfileId: number, albumPath: string) => {
  await dbQuery(`DELETE FROM __PREFIX__access_profile_albums WHERE access_profile_id = ? AND album_path = ?`, [
    accessProfileId,
    albumPath,
  ]);
  await dbQuery(
    `DELETE FROM __PREFIX__access_profile_albums
     WHERE access_profile_id = ?
       AND album_path LIKE ?`,
    [accessProfileId, `${albumPath}/%`]
  );
};

export const countAdmins = async () => {
  const rows = await dbQuery<{ total: number }[]>(
    `SELECT COUNT(*) AS total FROM __PREFIX__users WHERE role = 'admin' AND status <> 'disabled'`
  );
  return Number(rows[0]?.total ?? 0);
};

export const setUserRole = async (userId: number, role: AdminUserListItem["role"]) => {
  await dbQuery(`UPDATE __PREFIX__users SET role = ? WHERE id = ?`, [role, userId]);
};

export const setUserStatus = async (userId: number, status: AdminUserListItem["status"]) => {
  await dbQuery(`UPDATE __PREFIX__users SET status = ? WHERE id = ?`, [status, userId]);
};

export const addUserProfile = async (userId: number, accessProfileId: number) => {
  await dbQuery(
    `INSERT INTO __PREFIX__user_access_profiles (user_id, access_profile_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE access_profile_id = access_profile_id`,
    [userId, accessProfileId]
  );
};

export const removeUserProfile = async (userId: number, accessProfileId: number) => {
  await dbQuery(`DELETE FROM __PREFIX__user_access_profiles WHERE user_id = ? AND access_profile_id = ?`, [
    userId,
    accessProfileId,
  ]);
};

export const deleteUser = async (userId: number) => {
  await dbQuery(`DELETE FROM __PREFIX__users WHERE id = ?`, [userId]);
};

export const deleteUserSessions = async (userId: number) => {
  await dbQuery(`DELETE FROM __PREFIX__sessions WHERE user_id = ?`, [userId]);
};
