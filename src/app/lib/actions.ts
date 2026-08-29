"use server";

import { handleServerError } from "./errorHandling";
import loginFormConf from "@/ui/login/validation.conf";
import signupFormConf from "@/ui/sign-up/validation.conf";

import type { DirectoryTree } from "directory-tree";
import type { FormState } from "@/definitions/formDefinitions";
import { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";
import { validateForm } from "./formValidation/formValidation";

const API_TIMEOUT_MS = 15_000;
const ALBUMS_REVALIDATE_SECONDS = 600;

// Next specific options to trigger re-caching
type FetchApiInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const apiError = (status: number, message: string): ApiErrorResponse => ({
  error: true,
  status,
  message,
});

const fetchApiJson = async <T>(
  url: URL,
  missingConfigMessage: string,
  init?: FetchApiInit
): Promise<T | ApiErrorResponse> => {
  if (!process.env.NEXT_PUBLIC_API) {
    handleServerError({ message: missingConfigMessage });
    return apiError(500, missingConfigMessage);
  }

  try {
    const response = await fetch(url, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message
          ? payload.message
          : `Request failed (${response.status})`;
      handleServerError({ message });
      return apiError(response.status, message);
    }

    if (payload == null) {
      const message = "API returned a non-JSON response";
      handleServerError({ message });
      return apiError(502, message);
    }

    return payload as T;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    const message = timedOut ? "The gallery API timed out" : "Could not reach the gallery API";
    handleServerError({ message });
    return apiError(timedOut ? 504 : 503, message);
  }
};

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
  return fetchApiJson<ImageDetails[]>(requestUrl, "CDN is missing in environment config!");
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
