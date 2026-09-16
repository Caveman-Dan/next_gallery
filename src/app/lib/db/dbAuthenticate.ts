import type { ResultSetHeader } from "mysql2";
import { dbQuery } from "@/lib/db/db";
import { hashPassword } from "@/lib/password";

export type AuthUser = {
  id: number;
  password_hash: string;
  status: "pending" | "active" | "disabled";
};

export type ProfileUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "admin" | "user";
  status: "pending" | "active" | "disabled";
};

export const getUserById = async (id: number) => {
  const users = await dbQuery<
    {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone: string | null;
      role: "admin" | "user";
      status: "pending" | "active" | "disabled";
    }[]
  >(
    `SELECT id, email, first_name, last_name, phone, role, status
     FROM __PREFIX__users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  const row = users[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    status: row.status,
  } satisfies ProfileUser;
};

export const getUserByEmail = async (email: string) => {
  const users = await dbQuery<AuthUser[]>(
    "SELECT id, password_hash, status FROM __PREFIX__users WHERE email = ? LIMIT 1",
    [email]
  );
  return users[0] ?? null;
};

export const createPendingUser = async (input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}) => {
  const passwordHash = await hashPassword(input.password);
  const result = await dbQuery<ResultSetHeader>(
    `INSERT INTO __PREFIX__users
      (email, password_hash, first_name, last_name, phone, role, status)
     VALUES (?, ?, ?, ?, ?, 'user', 'pending')`,
    [input.email, passwordHash, input.firstName, input.lastName, input.phone || null]
  );
  return result.insertId;
};

export const updateUserProfile = async (
  userId: number,
  input: { email: string; firstName: string; lastName: string; phone: string }
) => {
  await dbQuery(
    `UPDATE __PREFIX__users
     SET email = ?, first_name = ?, last_name = ?, phone = ?
     WHERE id = ?`,
    [input.email, input.firstName, input.lastName, input.phone || null, userId]
  );
};

export const updateUserPassword = async (userId: number, password: string) => {
  const passwordHash = await hashPassword(password);
  await dbQuery(`UPDATE __PREFIX__users SET password_hash = ? WHERE id = ?`, [passwordHash, userId]);
};
