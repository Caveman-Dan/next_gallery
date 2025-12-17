"use server";

import "dotenv/config";

import { handleServerError } from "./errorHandling";

import { loginFormInitialState } from "@/ui/login/LoginForm";
import type { DirectoryTree } from "directory-tree";
import type { LoginFormState } from "@/ui/login/LoginForm";
import { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

export const getAlbums = async (): Promise<DirectoryTree> => {
  let albumsTree;

  if (process.env.NEXT_PUBLIC_API && process.env.NEXT_PUBLIC_API_GET_ALBUMS) {
    const requestUrl = new URL(`${process.env.NEXT_PUBLIC_API}${process.env.NEXT_PUBLIC_API_GET_ALBUMS}`);
    albumsTree = await fetch(requestUrl).then((response) => response.json());
  } else handleServerError({ message: "API config error!" });

  return albumsTree;
};

export const getImages = async (imageDirectory: string): Promise<ImageDetails[] | ApiErrorResponse | null> => {
  if (process.env.NEXT_PUBLIC_API && process.env.NEXT_PUBLIC_API_GET_IMAGES) {
    const searchParams = new URLSearchParams({ locate: imageDirectory });
    const requestUrl = new URL(`${process.env.NEXT_PUBLIC_API}${process.env.NEXT_PUBLIC_API_GET_IMAGES}`);
    requestUrl.search = searchParams.toString();

    return await fetch(requestUrl.href).then((response) => response.json());
  } else handleServerError({ message: "CDN is missing in environment config!" });

  return null;
};

export const authenticateSignIn = async (prevState: LoginFormState, formData?: FormData): Promise<LoginFormState> => {
  const email = formData?.get("email") as string;
  const password = formData?.get("password") as string;

  console.log("Authenticating", { formData: { email, password } });

  let newState = {
    email: { ...loginFormInitialState.email },
    pwd: { ...loginFormInitialState.pwd },
  };

  if (!email) {
    newState.email.error = true;
    newState.email.message = "Email is required!";
  } else {
    newState = {
      ...newState,
      email: { value: email, error: false, message: "" },
    };
  }

  if (!password) {
    newState.pwd.error = true;
    newState.pwd.message = "Password is required!";
  } else {
    newState = {
      ...newState,
      pwd: { value: "", error: false, message: "Logged in successfully!" },
    };
  }

  console.log("Previous/New state", { prevState, newState });

  return newState;
};
