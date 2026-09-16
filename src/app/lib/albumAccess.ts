import type { DirectoryTree } from "directory-tree";
import type { AlbumAccess } from "@/lib/db/dbAccess";

const normalise = (path: string) => path.replace(/^\/+|\/+$/g, "");

const relativePath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  if (nodePath.startsWith(prefix)) return nodePath.slice(prefix.length);
  return nodePath;
};

export const albumPathAllowed = (albumPath: string, access: AlbumAccess) => {
  if (access.all) return true;
  const requested = normalise(albumPath);
  return access.paths.some((allowed) => {
    const grant = normalise(allowed);
    return requested === grant || requested.startsWith(`${grant}/`);
  });
};

const nodeVisible = (relative: string, access: AlbumAccess) => {
  if (access.all) return true;
  if (!relative) return true;
  const current = normalise(relative);
  return access.paths.some((allowed) => {
    const grant = normalise(allowed);
    return current === grant || current.startsWith(`${grant}/`) || grant.startsWith(`${current}/`);
  });
};

export const filterAlbumTree = (tree: DirectoryTree, access: AlbumAccess): DirectoryTree => {
  if (access.all) return tree;

  const filterNode = (node: DirectoryTree, rootPath: string): DirectoryTree | null => {
    const relative = relativePath(node.path, rootPath);
    const children = node.children
      ?.map((child) => filterNode(child, rootPath))
      .filter((child): child is DirectoryTree => child !== null);

    if (!nodeVisible(relative, access) && !children?.length) return null;
    return { ...node, children };
  };

  const children = tree.children
    ?.map((child) => filterNode(child, tree.path))
    .filter((child): child is DirectoryTree => child !== null);

  return { ...tree, children };
};
