import dirTree from "directory-tree";
import uniqid from "uniqid";

import type { DirectoryTreeCallback, DirectoryTree } from "directory-tree";

const directoryCallback: DirectoryTreeCallback = (item) => {
  item.custom = { id: uniqid() };
  item.path = item.path.replace(`${process.env.IMAGES_FOLDER}/`, "");
  if (item.name === process.env.IMAGES_FOLDER) item.name = "root_folder";
};

export const GET = async () => {
  const albumsTree: DirectoryTree = await dirTree(
    `${process.env.IMAGES_FOLDER}/`,
    {
      attributes: ["type"],
      exclude: [/\.DS_Store/],
      extensions: /a^/, // match nothing to return only directories (anything with no extension)
    },
    () => null,
    directoryCallback
  );

  return Response.json(albumsTree);
};
