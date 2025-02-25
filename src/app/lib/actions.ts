"use server";

import "dotenv/config";

import type { InputState } from "@/ui/components/InputBox/InputBox";
import type { GetAlbumsInterface } from "@/lib/definitions";

export const getAlbums = async (): Promise<GetAlbumsInterface> => {
  let albumsTree;

  if (process.env.CDN && process.env.CDN_GET_ALBUMS) {
    const requestUrl = new URL(`${process.env.CDN}${process.env.CDN_GET_ALBUMS}`);
    albumsTree = await fetch(requestUrl).then((response) => response.json());
  } else console.error("API config error!");

  return albumsTree;
};

export const getImages = async (imageDirectory: string) => {
  let images;

  if (process.env.CDN && process.env.CDN_GET_IMAGES) {
    const searchParams = new URLSearchParams({ locate: imageDirectory });
    const requestUrl = new URL(`${process.env.CDN}${process.env.CDN_GET_IMAGES}`);
    requestUrl.search = searchParams.toString();

    images = await fetch(requestUrl.href).then((response) => response.json());
  } else console.error("CDN is missing in environment config!");

  return images;
};

export const authenticate = async (prevState: { [key: string]: InputState } | undefined, formData: FormData) => {
  await console.log("Authenticating", { prevState, formData });

  return { message: "Authenticating" };
};
