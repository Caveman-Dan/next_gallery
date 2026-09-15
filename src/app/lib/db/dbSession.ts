import { randomBytes } from "node:crypto";
import { dbQuery } from "@/lib/db/db";
import { clearSessionCookie, getSessionCookie, setSessionCookie } from "@/lib/sessionCookie";

const SESSION_DAYS = 30;

export type SessionUser = {
  id: string;
  userId: number;
  email: string;
  role: "admin" | "user";
  status: "pending" | "active" | "disabled";
  expiresAt: Date;
};

export const createSession = async (userId: number) => {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await dbQuery("INSERT INTO __PREFIX__sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [id, userId, expiresAt]);
  await setSessionCookie(id, expiresAt);
};

export const getSession = async (): Promise<SessionUser | null> => {
  const id = await getSessionCookie();
  if (!id) return null;

  const rows = await dbQuery<
    {
      id: string;
      user_id: number;
      email: string;
      role: "admin" | "user";
      status: "pending" | "active" | "disabled";
      expires_at: Date;
    }[]
  >(
    `SELECT s.id, s.user_id, s.expires_at, u.email, u.role, u.status
     FROM __PREFIX__sessions s
     INNER JOIN __PREFIX__users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [id]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    role: row.role,
    status: row.status,
    expiresAt: row.expires_at,
  };
};

export const deleteSession = async () => {
  const id = await getSessionCookie();
  if (id) {
    await dbQuery("DELETE FROM __PREFIX__sessions WHERE id = ?", [id]);
  }
  await clearSessionCookie();
};
