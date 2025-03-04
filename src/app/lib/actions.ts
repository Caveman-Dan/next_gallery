"use server";

import "dotenv/config";

import { handleServerError } from "./errorHandling";

import { InputState } from "@/ui/components/InputBox/InputBox";
import { GetAlbumsInterface, ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

export const getAlbums = async (): Promise<GetAlbumsInterface> => {
  let albumsTree;

  if (process.env.API && process.env.API_GET_ALBUMS) {
    const requestUrl = new URL(`${process.env.API}${process.env.API_GET_ALBUMS}`);
    albumsTree = await fetch(requestUrl).then((response) => response.json());
  } else handleServerError({ message: "API config error!" });

  return albumsTree;
};

export const getImages = async (imageDirectory: string): Promise<ImageDetails[] | Promise<ApiErrorResponse> | null> => {
  // let getImagesResponse: GetImagesResponse;

  if (process.env.API && process.env.API_GET_IMAGES) {
    const searchParams = new URLSearchParams({ locate: imageDirectory });
    const requestUrl = new URL(`${process.env.API}${process.env.API_GET_IMAGES}`);
    requestUrl.search = searchParams.toString();

    return await fetch(requestUrl.href).then((response) => response.json());
  } else handleServerError({ message: "CDN is missing in environment config!" });

  // return getImagesResponse;
  return null;
};

export const authenticate = async (prevState: { [key: string]: InputState } | undefined, formData: FormData) => {
  await console.log("Authenticating", { prevState, formData });

  return { message: "Authenticating" };
};
