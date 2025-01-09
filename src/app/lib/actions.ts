"use server";

import "dotenv/config";
import dirTree from "directory-tree";
import uniqid from "uniqid";

const directoryCallback = (item) => {
  item.id = uniqid();
  item.path = item.path.replace(`${process.env.IMAGES_FOLDER}/`, "");
  if (item.name === process.env.IMAGES_FOLDER) item.name = "root_folder";
};

export const getAlbums = async () => {
  const albumsTree = await dirTree(
    `${process.env.IMAGES_FOLDER}/`,
    {
      attributes: ["type"],
      exclude: [/\.DS_Store/],
      extensions: /a^/, // match nothing to return only directories (anything with no extension)
    },
    () => null,
    directoryCallback
  );
  // return processDirTree(albumsTree.children);
  return albumsTree;
};
