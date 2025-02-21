"use server";

import "dotenv/config";
import { readdir } from "node:fs/promises";
import path from "path";
import dirTree from "directory-tree";
import uniqid from "uniqid";

import type { DirectoryTree, DirectoryTreeCallback } from "directory-tree";
import type { InputState } from "@/ui/components/InputBox/InputBox";

export interface GetAlbumsInterface extends DirectoryTree {
  custom: {
    id: string;
  };
}

const directoryCallback: DirectoryTreeCallback = (item) => {
  item.custom = { id: uniqid() };
  item.path = item.path.replace(`${process.env.IMAGES_FOLDER}/`, "");
  if (item.name === process.env.IMAGES_FOLDER) item.name = "root_folder";
};

export const getAlbums = async (): Promise<GetAlbumsInterface> => {
  let albumsTree;

  if (process.env.CDN === "localhost") {
    albumsTree = await dirTree(
      `${process.env.IMAGES_FOLDER}/`,
      {
        attributes: ["type"],
        exclude: [/\.DS_Store/],
        extensions: /a^/, // match nothing to return only directories (anything with no extension)
      },
      () => null,
      directoryCallback
    );
  } else if (process.env.CDN && process.env.CDN_GET_ALBUMS) {
    albumsTree = await fetch(path.join(process.env.CDN, process.env.CDN_GET_ALBUMS)).then((response) =>
      response.json()
    );
  } else console.error("CDN is missing in environment config!");

  return albumsTree;
};

export const getImages = async (imageDirectory: string) => {
  let images;

  if (process.env.CDN === "localhost") {
    const imageFolder = path.join(`./${process.env.IMAGES_FOLDER}`, `${decodeURIComponent(imageDirectory)}/`);

    try {
      images = await readdir(imageFolder);
    } catch (err) {
      console.error("Error reading images directory: ", err);
    }
  } else if (process.env.CDN && process.env.CDN_GET_IMAGES) {
    const searchParams = new URLSearchParams({ locate: imageDirectory });
    const requestUrl = new URL(process.env.CDN_GET_IMAGES, process.env.CDN);
    requestUrl.search = searchParams.toString();

    images = await fetch(requestUrl).then((res) => res.json());
  } else console.error("CDN is missing in environment config!");

  return images;
};

export const authenticate = async (prevState: { [key: string]: InputState } | undefined, formData: FormData) => {
  await console.log("Authenticating", { prevState, formData });

  return { message: "Authenticating" };
};
