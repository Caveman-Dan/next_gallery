"use server";

import "dotenv/config";
import dirTree from "directory-tree";

const processDirTree = (tree) =>
  tree.map((dir) => ({
    ...dir,
    path: dir.path.replace(`${process.env.IMAGES_FOLDER}/`, ""),
    children: dir?.children ? processDirTree(dir.children) : [],
  }));

export const getAlbums = async () => {
  const albumsTree = await dirTree(`${process.env.IMAGES_FOLDER}/`, {
    attributes: ["type"],
    exclude: [/\.DS_Store/],
    extensions: /a^/, // match nothing to return only directories (anything with no extension)
  });
  return processDirTree(albumsTree.children);
};
