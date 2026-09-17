"use server";

import { updateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { handleServerError } from "./errorHandling";
import loginFormConf from "@/ui/login/validation.conf";
import signupFormConf from "@/ui/sign-up/validation.conf";
import { validateForm } from "./formValidation/formValidation";
import { fetchApiJson } from "./fetchApiJson";
import { apiError, isApiErrorResponse, isGalleryCacheTag } from "./helpers";
import { ALBUMS_REVALIDATE_SECONDS, IMAGES_REVALIDATE_SECONDS, REVALIDATION_TAGS } from "./apiConfig";
import { createPendingUser, getUserByEmail, updateUserPassword, updateUserProfile } from "./db/dbAuthenticate";
import { profileFormConf, passwordFormConf } from "@/ui/UserProfile/validation.conf";
import { createSession, deleteSession } from "./db/dbSession";
import { getAllowedAlbumPaths, getPrincipal } from "./db/dbAccess";
import {
  addProfileAlbum,
  addUserProfile,
  countAdmins,
  deleteUser,
  listAdminUsers,
  removeUserProfile,
  setUserRole,
  setUserStatus,
  removeProfileAlbum,
  setProfilePublic,
} from "./db/dbUsers";
import { albumPathAllowed, filterAlbumTree } from "./albumAccess";

import type { DirectoryTree } from "directory-tree";
import type { FormState } from "@/definitions/formDefinitions";
import type { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";
import { readFormValues } from "./formValidation/formHelpers";

export const getGalleryData = async (): Promise<DirectoryTree | ApiErrorResponse> => {
  if (!process.env.API_GET_ALBUMS) {
    const message = "API config error!";
    handleServerError({ message });
  }

  const principal = await getPrincipal();
  const access = await getAllowedAlbumPaths();
  const cacheUser =
    principal.kind === "guest"
      ? "guest"
      : principal.kind === "admin"
        ? `admin:${principal.user.userId}`
        : `user:${principal.user.userId}`;

  const requestUrl = new URL(`${process.env.API}${process.env.API_GET_ALBUMS}`);
  const tree = await fetchApiJson<DirectoryTree>(requestUrl, "API config error!", {
    next: {
      revalidate: ALBUMS_REVALIDATE_SECONDS,
      tags: [`${REVALIDATION_TAGS.galleryDataPrefix}${cacheUser}`],
    },
  });

  if (isApiErrorResponse(tree)) return tree;
  return filterAlbumTree(tree, access);
};

export const getImages = async (imageDirectory: string): Promise<ImageDetails[] | ApiErrorResponse> => {
  if (!process.env.API_GET_IMAGES) {
    const message = "CDN is missing in environment config!";
    handleServerError({ message });
  }

  const access = await getAllowedAlbumPaths();
  if (!albumPathAllowed(imageDirectory, access)) {
    return apiError(403, "You do not have access to this album");
  }

  const requestUrl = new URL(
    `${process.env.API}${process.env.API_GET_IMAGES}/${imageDirectory.split("/").map(encodeURIComponent).join("/")}`
  );
  return fetchApiJson<ImageDetails[]>(requestUrl, "CDN is missing in environment config!", {
    next: {
      revalidate: IMAGES_REVALIDATE_SECONDS,
      tags: [REVALIDATION_TAGS.albums, `${REVALIDATION_TAGS.albumPrefix}${imageDirectory}`],
    },
  });
};

export const revalidateGalleryCache = async (tags: string[]) => {
  const successful: string[] = [];

  for (const tag of tags) {
    if (!isGalleryCacheTag(tag)) {
      return apiError(400, `${tag} - Invalid tag`);
    }
    updateTag(tag);
    successful.push(tag);
  }

  return successful;
};

export const authenticateSignIn = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const formValues = readFormValues(formData, loginFormConf);

  const formState = await validateForm(formValues, loginFormConf);
  const hasFieldErrors = Object.values(formState).some((field) => field.errors);
  if (hasFieldErrors) return formState;

  const user = await getUserByEmail(formValues.email);
  if (!user) return formState;

  await createSession(user.id);
  redirect("/gallery");
};

export const authenticateSignup = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const formValues = readFormValues(formData, signupFormConf);

  const formState = await validateForm(formValues, signupFormConf);
  const hasFieldErrors = Object.values(formState).some((field) => field.errors);
  if (hasFieldErrors) return formState;

  const userId = await createPendingUser({
    email: formValues.email,
    password: formValues.password,
    firstName: formValues.forename,
    lastName: formValues.surname,
    phone: formValues.phone,
  });

  await createSession(userId);
  redirect("/gallery");
};

export const logout = async () => {
  await deleteSession();
  redirect("/gallery");
};

export const updateProfile = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const principal = await getPrincipal();
  if (principal.kind === "guest" || !principal.user) {
    redirect("/login");
  }

  const formValues = readFormValues(formData, profileFormConf);
  const formState = await validateForm(formValues, profileFormConf);
  if (Object.values(formState).some((field) => field.errors)) return formState;

  await updateUserProfile(principal.user.userId, {
    email: formValues.email,
    firstName: formValues.forename,
    lastName: formValues.surname,
    phone: formValues.phone,
  });

  formState.email.messages = [...(formState.email.messages ?? []), "Profile saved"];
  return formState;
};

export const changePassword = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const principal = await getPrincipal();
  if (principal.kind === "guest" || !principal.user) {
    redirect("/login");
  }

  const formValues = readFormValues(formData, passwordFormConf);
  const formState = await validateForm(formValues, passwordFormConf);
  if (Object.values(formState).some((field) => field.errors)) return formState;

  await updateUserPassword(principal.user.userId, formValues.newPassword);
  formState.newPassword.messages = [...(formState.newPassword.messages ?? []), "Password updated"];
  return formState;
};

const requireAdmin = async () => {
  const principal = await getPrincipal();
  if (principal.kind !== "admin" || !principal.user) {
    handleServerError({ message: "Forbidden" });
  }
  return principal.user;
};

const isLastAdminId = async (userId: number) => {
  const users = await listAdminUsers();
  const target = users.find((user) => user.id === userId);
  if (!target || target.role !== "admin") return false;
  return (await countAdmins()) <= 1;
};

export const adminDeleteUser = async (formData: FormData) => {
  const actor = await requireAdmin();
  const userId = Number(formData.get("userId"));
  if (!userId || userId === actor?.userId) return;
  if (await isLastAdminId(userId)) return;
  await deleteUser(userId);
  revalidatePath("/gallery/admin");
};

export const adminSetUserRole = async (formData: FormData) => {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const role = formData.get("role");
  if (!userId || (role !== "admin" && role !== "user")) return;
  if (role === "user" && (await isLastAdminId(userId))) return;
  await setUserRole(userId, role);
  revalidatePath("/gallery/admin");
};

export const adminToggleUserActive = async (formData: FormData) => {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const pending = formData.get("pending") === "true";
  if (!userId) handleServerError({ message: "Missing user" });
  if (pending) {
    if (await isLastAdminId(userId)) return;
    await setUserStatus(userId, "pending");
  } else {
    await setUserStatus(userId, "active");
  }
  revalidatePath("/gallery/admin");
};

export const adminSetUserProfile = async (formData: FormData) => {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const accessProfileId = Number(formData.get("accessProfileId"));
  const granted = formData.get("granted") === "true";
  if (!userId || !accessProfileId) handleServerError({ message: "Missing profile grant" });

  const users = await listAdminUsers();
  const target = users.find((user) => user.id === userId);
  if (!target || target.status !== "active") return;
  if (granted) await addUserProfile(userId, accessProfileId);
  else await removeUserProfile(userId, accessProfileId);
  revalidatePath("/gallery/admin");
};

export const adminSetProfileAlbum = async (formData: FormData) => {
  await requireAdmin();
  const accessProfileId = Number(formData.get("accessProfileId"));
  const albumPath = String(formData.get("albumPath") ?? "");
  const granted = formData.get("granted") === "true";
  if (!accessProfileId || !albumPath) return;
  if (granted) await addProfileAlbum(accessProfileId, albumPath);
  else await removeProfileAlbum(accessProfileId, albumPath);
  revalidatePath("/gallery/admin");
};

export const adminSetProfilePublic = async (formData: FormData) => {
  await requireAdmin();
  const accessProfileId = Number(formData.get("accessProfileId"));
  const isPublic = formData.get("isPublic") === "true";
  if (!accessProfileId) return;
  await setProfilePublic(accessProfileId, isPublic);
  revalidatePath("/gallery/admin");
};
