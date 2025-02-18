"use server";

import "dotenv/config";
import dirTree from "directory-tree";
import uniqid from "uniqid";

import { DirectoryTreeCallback } from "directory-tree";

import type { InputState } from "@/ui/components/InputBox/InputBox";

const processPath = (path) => path.replace(`${process.env.IMAGES_FOLDER}/`, "").replace(/ /g, "_");

const directoryCallback: DirectoryTreeCallback = (item) => {
  item.custom = { id: uniqid() };
  item.path = processPath(item.path);
  if (item.name === process.env.IMAGES_FOLDER) item.name = "root_folder";
};

export const getAlbums = async () => {
  let albumsTree = {};

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
  } else {
    albumsTree = await fetch(process.env.CDN).then((response) => response.json());
  }
  // return processDirTree(albumsTree.children);
  return albumsTree;
};
