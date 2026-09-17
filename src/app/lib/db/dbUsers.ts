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
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    isPublic: Boolean(row.public),
  })) satisfies AccessProfileOption[];
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
