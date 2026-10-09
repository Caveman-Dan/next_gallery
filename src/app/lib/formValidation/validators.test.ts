import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUserByEmail, type AuthUser } from "@/lib/db/dbAuthenticate";
import { getPrincipal } from "@/lib/db/dbAccess";
import { verifyPassword } from "@/lib/password";
import {
  isFieldEmpty,
  isMatchingPassword,
  isValidEmail,
  isCurrentPassword,
  isEmailUnique,
  isEmailUnusedByOthers,
  isValidLogin,
} from "./validators";

vi.mock("@/lib/db/dbAuthenticate", () => ({
  getUserByEmail: vi.fn(
    async (): Promise<{ id: number; password_hash: string; status: "pending" | "active" | "disabled" } | null> => null
  ),
}));

vi.mock("@/lib/db/dbAccess", () => ({
  getPrincipal: vi.fn(),
}));

vi.mock("@/lib/password", () => ({
  verifyPassword: vi.fn(),
}));

const options = { errorMessage: "nope" };

describe("isFieldEmpty", () => {
  it("errors on an empty string and uses the options message", () => {
    expect(isFieldEmpty("", options)).toEqual({ value: "", error: true, message: "nope" });
  });

  it("accepts a non-empty string", () => {
    expect(isFieldEmpty("x", options)).toEqual({ value: "x", error: false, message: "" });
  });
});

describe("isValidEmail", () => {
  it("accepts an empty string, matching checkValidEmail", () => {
    expect(isValidEmail("", options).error).toBe(false);
  });

  it("rejects a malformed address", () => {
    expect(isValidEmail("not-an-email", options)).toEqual({ value: "not-an-email", error: true, message: "nope" });
  });
});

describe("isMatchingPassword", () => {
  it("errors when the value does not match newPassword", () => {
    expect(isMatchingPassword("a", options, { newPassword: "b" })).toEqual({
      value: "a",
      error: true,
      message: "nope",
    });
  });

  it("accepts a match", () => {
    expect(isMatchingPassword("same", options, { newPassword: "same" }).error).toBe(false);
  });
});

const user = { id: 7, password_hash: "hash", status: "active" as const };
const principal = {
  kind: "user" as const,
  user: {
    id: "session",
    userId: 7,
    email: "dan@waxworlds.org",
    role: "user" as const,
    status: "active" as const,
    expiresAt: new Date(),
  },
};

describe("isValidLogin", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("errors when the email is unknown, the password is wrong, or the user is disabled", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue(null as unknown as AuthUser);
    expect(await isValidLogin("secret", options, { email: "missing@waxworlds.org" })).toMatchObject({ error: true });

    vi.mocked(getUserByEmail).mockResolvedValue(user);
    vi.mocked(verifyPassword).mockResolvedValue(false);
    expect(await isValidLogin("secret", options, { email: "dan@waxworlds.org" })).toMatchObject({ error: true });

    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(getUserByEmail).mockResolvedValue({ ...user, status: "disabled" });
    expect(await isValidLogin("secret", options, { email: "dan@waxworlds.org" })).toMatchObject({ error: true });
  });

  it("accepts an active user with a matching password", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue(user);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    expect(await isValidLogin("secret", options, { email: "dan@waxworlds.org" })).toEqual({
      value: "secret",
      error: false,
      message: "",
    });
  });
});

describe("isEmailUnique", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("errors when the email is taken and accepts a free one", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue(user);
    expect(await isEmailUnique("dan@waxworlds.org", options)).toMatchObject({ error: true, message: "nope" });

    vi.mocked(getUserByEmail).mockResolvedValue(null as unknown as AuthUser);
    expect(await isEmailUnique("new@waxworlds.org", options)).toMatchObject({ error: false });
  });
});

describe("isEmailUnusedByOthers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("allows the signed-in user's own email", async () => {
    vi.mocked(getPrincipal).mockResolvedValue(principal);
    vi.mocked(getUserByEmail).mockResolvedValue(user);
    expect(await isEmailUnusedByOthers("dan@waxworlds.org", options)).toMatchObject({ error: false });
  });

  it("rejects another user's email", async () => {
    vi.mocked(getPrincipal).mockResolvedValue(principal);
    vi.mocked(getUserByEmail).mockResolvedValue({ ...user, id: 9 });
    expect(await isEmailUnusedByOthers("other@waxworlds.org", options)).toMatchObject({ error: true });
  });

  it("rejects a taken email when there is no signed-in user", async () => {
    vi.mocked(getPrincipal).mockResolvedValue({ kind: "guest", user: null });
    vi.mocked(getUserByEmail).mockResolvedValue(user);
    expect(await isEmailUnusedByOthers("dan@waxworlds.org", options)).toMatchObject({ error: true });
  });
});

describe("isCurrentPassword", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("errors when there is no signed-in user", async () => {
    vi.mocked(getPrincipal).mockResolvedValue({ kind: "guest", user: null });
    expect(await isCurrentPassword("secret", options)).toMatchObject({ error: true });
    expect(getUserByEmail).not.toHaveBeenCalled();
  });

  it("errors on a wrong password and accepts the right one", async () => {
    vi.mocked(getPrincipal).mockResolvedValue(principal);
    vi.mocked(getUserByEmail).mockResolvedValue(user);
    vi.mocked(verifyPassword).mockResolvedValue(false);
    expect(await isCurrentPassword("secret", options)).toMatchObject({ error: true });

    vi.mocked(verifyPassword).mockResolvedValue(true);
    expect(await isCurrentPassword("secret", options)).toMatchObject({ error: false });
  });
});
