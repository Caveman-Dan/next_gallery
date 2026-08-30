"use server";

import { handleServerError } from "./errorHandling";
import loginFormConf from "@/ui/login/validation.conf";
import signupFormConf from "@/ui/sign-up/validation.conf";
import { validateForm } from "./formValidation/formValidation";
import { fetchApiJson } from "./fetchApiJson";
import { apiError } from "./helpers";
import { ALBUMS_REVALIDATE_SECONDS, IMAGES_REVALIDATE_SECONDS } from "./apiConfig";

import type { DirectoryTree } from "directory-tree";
import type { FormState } from "@/definitions/formDefinitions";
import type { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

export const getAlbums = async (): Promise<DirectoryTree | ApiErrorResponse> => {
  if (!process.env.NEXT_PUBLIC_API_GET_ALBUMS) {
    const message = "API config error!";
    handleServerError({ message });
    return apiError(500, message);
  }

  const requestUrl = new URL(`${process.env.NEXT_PUBLIC_API}${process.env.NEXT_PUBLIC_API_GET_ALBUMS}`);
  return fetchApiJson<DirectoryTree>(requestUrl, "API config error!", {
    next: { revalidate: ALBUMS_REVALIDATE_SECONDS, tags: ["albums"] },
  });
};

export const getImages = async (imageDirectory: string): Promise<ImageDetails[] | ApiErrorResponse> => {
  if (!process.env.NEXT_PUBLIC_API_GET_IMAGES) {
    const message = "CDN is missing in environment config!";
    handleServerError({ message });
    return apiError(500, message);
  }

  const requestUrl = new URL(`${process.env.NEXT_PUBLIC_API}${process.env.NEXT_PUBLIC_API_GET_IMAGES}`);
  requestUrl.search = new URLSearchParams({ locate: imageDirectory }).toString();
};

export const authenticateSignIn = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const formValues: { [key: string]: string } = {
    email: formData?.get("email") as string,
    pwd: formData?.get("password") as string,
  };

  return await validateForm(formValues, loginFormConf);
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

  return await validateForm(formValues, signupFormConf);
};
