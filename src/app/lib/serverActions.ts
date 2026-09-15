"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { handleServerError } from "./errorHandling";
import loginFormConf from "@/ui/login/validation.conf";
import signupFormConf from "@/ui/sign-up/validation.conf";
import { validateForm } from "./formValidation/formValidation";
import { fetchApiJson } from "./fetchApiJson";
import { apiError, isGalleryCacheTag } from "./helpers";
import { ALBUMS_REVALIDATE_SECONDS, IMAGES_REVALIDATE_SECONDS, REVALIDATION_TAGS } from "./apiConfig";
import { createPendingUser, getUserByEmail } from "./db/dbAuthenticate";
import { createSession, deleteSession } from "./db/dbSession";

import type { DirectoryTree } from "directory-tree";
import type { FormState } from "@/definitions/formDefinitions";
import type { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

export const getGalleryData = async (): Promise<DirectoryTree | ApiErrorResponse> => {
  if (!process.env.API_GET_ALBUMS) {
    const message = "API config error!";
    handleServerError({ message });
    return apiError(500, message);
  }

  const requestUrl = new URL(`${process.env.API}${process.env.API_GET_ALBUMS}`);
  return fetchApiJson<DirectoryTree>(requestUrl, "API config error!", {
    next: { revalidate: ALBUMS_REVALIDATE_SECONDS, tags: [REVALIDATION_TAGS.galleryData] },
  });
};

export const getImages = async (imageDirectory: string): Promise<ImageDetails[] | ApiErrorResponse> => {
  if (!process.env.API_GET_IMAGES) {
    const message = "CDN is missing in environment config!";
    handleServerError({ message });
    return apiError(500, message);
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
  const formValues: { [key: string]: string } = {
    email: formData?.get("email") as string,
    pwd: formData?.get("password") as string,
  };

  const formState = await validateForm(formValues, loginFormConf);
  const hasFieldErrors = Object.values(formState).some((field) => field.errors);
  if (hasFieldErrors) return formState;

  const user = await getUserByEmail(formValues.email);
  if (!user) return formState;

  await createSession(user.id);
  redirect("/gallery");
};

export const authenticateSignup = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const formValues: { [key: string]: string } = {
    forename: formData?.get("forename") as string,
    surname: formData?.get("surname") as string,
    username: formData?.get("username") as string,
    email: formData?.get("email") as string,
    pwd: formData?.get("password") as string,
    phone: formData?.get("phone") as string,
  };

  const formState = await validateForm(formValues, signupFormConf);
  const hasFieldErrors = Object.values(formState).some((field) => field.errors);
  if (hasFieldErrors) return formState;

  const userId = await createPendingUser({
    email: formValues.email,
    password: formValues.pwd,
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
