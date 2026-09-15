import { cookies } from "next/headers";

import authConfig from "@/lib/authConfig";
const { COOKIE_NAME } = authConfig;

const cookiePath = () => process.env.BASE_PATH || "/";

const cookieOptions = (expires: Date, path = cookiePath()) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // Prevent CSRF
  path,
  expires,
});

export const getSessionCookie = async () => {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
};

export const setSessionCookie = async (id: string, expires: Date) => {
  const store = await cookies();
  store.set(COOKIE_NAME, id, cookieOptions(expires));
};

export const clearSessionCookie = async () => {
  const store = await cookies();
  store.set(COOKIE_NAME, "", cookieOptions(new Date(0)));
};
