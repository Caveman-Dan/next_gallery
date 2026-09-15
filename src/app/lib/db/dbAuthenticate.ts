import { dbQuery } from "@/lib/db/db";

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
