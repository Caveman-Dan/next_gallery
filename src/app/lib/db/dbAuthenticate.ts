import type { ResultSetHeader } from "mysql2";
import { dbQuery } from "@/lib/db/db";
import { hashPassword } from "@/lib/password";

export type AuthUser = {
  id: number;
  password_hash: string;
  status: "pending" | "active" | "disabled";
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
