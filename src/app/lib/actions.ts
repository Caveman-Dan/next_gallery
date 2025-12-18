"use server";

import "dotenv/config";

import { handleServerError } from "./errorHandling";
import loginFormConf from "./formValidation/formConfigurations/loginFormConf";

import type { DirectoryTree } from "directory-tree";
import type { FormState } from "@/definitions/formDefinitions";
import { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";
import { validateForm } from "./formValidation/formValidation";

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

export const authenticateSignIn = async (prevState: FormState, formData?: FormData): Promise<FormState> => {
  const formValues: { [key: string]: string } = {
    email: formData?.get("email") as string,
    pwd: formData?.get("password") as string,
  };

  return validateForm(formValues, loginFormConf);
};
