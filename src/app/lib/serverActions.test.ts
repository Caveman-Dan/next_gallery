import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ updateTag: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

vi.mock("./db/dbAuthenticate", () => ({
  getUserByEmail: vi.fn(),
  createPendingUser: vi.fn(),
  updateUserProfile: vi.fn(),
  updateUserPassword: vi.fn(),
}));

vi.mock("./db/dbAccess", () => ({
  getPrincipal: vi.fn(),
  getAllowedAlbumPaths: vi.fn(),
}));

vi.mock("./db/dbSession", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock("./db/dbUsers", () => ({
  setProfileAlbums: vi.fn(),
}));

vi.mock("./formValidation/formValidation", () => ({
  validateForm: vi.fn(),
}));

vi.mock("./fetchApiJson", () => ({
  fetchApiJson: vi.fn(),
}));

vi.mock("./imageToken", () => ({
  signedImageSrc: vi.fn((path: string) => `/signed/${path}`),
}));

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserByEmail, createPendingUser } from "./db/dbAuthenticate";
import { getPrincipal } from "./db/dbAccess";
import { createSession, deleteSession } from "./db/dbSession";
import { setProfileAlbums } from "./db/dbUsers";
import { validateForm } from "./formValidation/formValidation";
import { fetchApiJson } from "./fetchApiJson";
import { getAllowedAlbumPaths } from "./db/dbAccess";
import { updateUserProfile } from "./db/dbAuthenticate";
import {
  adminReplaceProfileAlbums,
  authenticateSignIn,
  authenticateSignup,
  getGalleryData,
  getImages,
  logout,
  updateProfile,
} from "./serverActions";

const clean = {
  email: { value: "", errors: false, messages: [] },
  password: { value: "", errors: false, messages: [] },
};
const invalid = { email: { value: "", errors: true, messages: ["Email address is required!"] } };

describe("serverActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns field errors and does not start a session", async () => {
    vi.mocked(validateForm).mockResolvedValue(invalid);
    const state = await authenticateSignIn({}, new FormData());
    expect(state.email.errors).toBe(true);
    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("starts a session and redirects after a valid sign-in", async () => {
    vi.mocked(validateForm).mockResolvedValue(clean);
    vi.mocked(getUserByEmail).mockResolvedValue({ id: 7, password_hash: "hash", status: "active" });
    const formData = new FormData();
    formData.set("email", "dan@waxworlds.org");
    await expect(authenticateSignIn({}, formData)).rejects.toThrow("REDIRECT");
    expect(createSession).toHaveBeenCalledWith(7);
    expect(redirect).toHaveBeenCalledWith("/gallery");
  });

  it("creates a pending user, starts a session, and redirects", async () => {
    vi.mocked(validateForm).mockResolvedValue({
      ...clean,
      forename: { value: "Dan", errors: false, messages: [] },
      surname: { value: "C", errors: false, messages: [] },
      phone: { value: "", errors: false, messages: [] },
    });
    vi.mocked(createPendingUser).mockResolvedValue(8);
    const formData = new FormData();
    formData.set("email", "new@waxworlds.org");
    formData.set("password", "secret");
    formData.set("forename", "Dan");
    formData.set("surname", "C");
    await expect(authenticateSignup({}, formData)).rejects.toThrow("REDIRECT");
    expect(createPendingUser).toHaveBeenCalledWith({
      email: "new@waxworlds.org",
      password: "secret",
      firstName: "Dan",
      lastName: "C",
      phone: "",
    });
    expect(createSession).toHaveBeenCalledWith(8);
    expect(redirect).toHaveBeenCalledWith("/gallery");
  });

  it("clears the session and redirects on logout", async () => {
    await expect(logout()).rejects.toThrow("REDIRECT");
    expect(deleteSession).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/gallery");
  });

  it("refuses to replace album grants unless the principal is an admin", async () => {
    vi.mocked(getPrincipal).mockResolvedValue({ kind: "user", user: null } as never);
    await expect(adminReplaceProfileAlbums(3, ["travel"])).rejects.toThrow("Forbidden");
    expect(setProfileAlbums).not.toHaveBeenCalled();
  });

  it("replaces album grants for an admin", async () => {
    vi.mocked(getPrincipal).mockResolvedValue({
      kind: "admin",
      user: { id: "s", userId: 1, email: "a@b.co", role: "admin", status: "active", expiresAt: new Date() },
    });
    await expect(adminReplaceProfileAlbums(3, ["travel", "home"])).resolves.toEqual({ ok: true });
    expect(setProfileAlbums).toHaveBeenCalledWith(3, ["travel", "home"]);
    expect(revalidatePath).toHaveBeenCalledWith("/gallery/admin");
  });

  it("filters the gallery tree with the caller's album access", async () => {
    vi.stubEnv("API", "http://gallery.test");
    vi.stubEnv("API_GET_ALBUMS", "/albums");
    vi.mocked(getPrincipal).mockResolvedValue({ kind: "guest", user: null });
    vi.mocked(getAllowedAlbumPaths).mockResolvedValue({ all: false, paths: ["travel/italy"] });
    vi.mocked(fetchApiJson).mockResolvedValue({
      name: "albums",
      path: "/albums",
      children: [
        { name: "travel", path: "/albums/travel", children: [{ name: "italy", path: "/albums/travel/italy" }] },
        { name: "home", path: "/albums/home" },
      ],
    });
    const tree = await getGalleryData();
    expect(tree).toMatchObject({ children: [{ name: "travel", children: [{ name: "italy" }] }] });
  });

  it("returns 403 when the image directory is not granted", async () => {
    vi.stubEnv("API_GET_IMAGES", "/images");
    vi.mocked(getAllowedAlbumPaths).mockResolvedValue({ all: false, paths: ["travel"] });
    await expect(getImages("home")).resolves.toEqual({
      error: true,
      status: 403,
      message: "You do not have access to this album",
    });
    expect(fetchApiJson).not.toHaveBeenCalled();
  });

  it("sends a guest to login before saving a profile", async () => {
    vi.mocked(getPrincipal).mockResolvedValue({ kind: "guest", user: null });
    await expect(updateProfile({}, new FormData())).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/login");
    expect(updateUserProfile).not.toHaveBeenCalled();
  });
});
