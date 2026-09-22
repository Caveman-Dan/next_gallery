import type { DirectoryTree } from "directory-tree";

export const relativeAlbumPath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  return nodePath.startsWith(prefix) ? nodePath.slice(prefix.length) : nodePath;
};

export const pathIsCovered = (albumPath: string, grants: string[]) =>
  grants.some((grant) => grant === albumPath || albumPath.startsWith(`${grant}/`));

const parentPath = (albumPath: string) => {
  if (!albumPath.includes("/")) return null;
  return albumPath.split("/").slice(0, -1).join("/");
};

const nodeAt = (root: DirectoryTree, albumPath: string) => {
  if (!albumPath) return root;
  let node: DirectoryTree | undefined = root;
  for (const part of albumPath.split("/")) {
    node = node.children?.find((child) => child.name === part);
    if (!node) return undefined;
  }
  return node;
};

export const collectDescendantPaths = (entry: DirectoryTree, rootPath: string) => {
  const paths: string[] = [];
  const walk = (node: DirectoryTree) => {
    for (const child of node.children ?? []) {
      const relative = relativeAlbumPath(child.path, rootPath);
      if (relative) paths.push(relative);
      walk(child);
    }
  };
  walk(entry);
  return paths;
};

const descendantsOf = (albums: DirectoryTree, rootPath: string, albumPath: string) => {
  const node = nodeAt(albums, albumPath);
  return node ? collectDescendantPaths(node, rootPath) : [];
};

const minimalCover = (paths: string[]) =>
  paths.filter((path, _, all) => !all.some((other) => other !== path && path.startsWith(`${other}/`)));

const nearestStoredAncestor = (albumPath: string, grants: string[]) => {
  let current = parentPath(albumPath);
  while (current) {
    if (grants.includes(current)) return current;
    current = parentPath(current);
  }
  return null;
};

// Folders/albums that should stay granted after removing exceptPath from a stored ancestor.
const siblingSubtreesToKeep = (albums: DirectoryTree, rootPath: string, ancestor: string, exceptPath: string) => {
  const kept: string[] = [];
  const suffix = ancestor && exceptPath.startsWith(`${ancestor}/`) ? exceptPath.slice(ancestor.length + 1) : exceptPath;
  const parts = suffix.split("/").filter(Boolean);
  let prefix = ancestor;
  for (const part of parts) {
    const node = nodeAt(albums, prefix);
    const nextPrefix = prefix ? `${prefix}/${part}` : part;
    for (const child of node?.children ?? []) {
      const relative = relativeAlbumPath(child.path, rootPath);
      if (relative && relative !== nextPrefix) kept.push(relative);
    }
    prefix = nextPrefix;
  }
  return kept;
};

const promoteAncestors = (grants: string[], startPath: string, albums: DirectoryTree, rootPath: string) => {
  let next = [...grants];
  let current = startPath;
  while (current) {
    const parent = parentPath(current);
    if (parent === null) break;
    const descendants = descendantsOf(albums, rootPath, parent);
    const allCovered = descendants.length > 0 && descendants.every((path) => pathIsCovered(path, next));
    if (!allCovered) break;
    next = [...next.filter((path) => path !== parent && !path.startsWith(`${parent}/`)), parent];
    current = parent;
  }
  return next;
};

export const nextAlbumPaths = (
  grants: string[],
  albumPath: string,
  nextChecked: boolean,
  albums: DirectoryTree,
  rootPath: string
) => {
  if (nextChecked) {
    const added = [...grants.filter((path) => path !== albumPath && !path.startsWith(`${albumPath}/`)), albumPath];
    return promoteAncestors(added, albumPath, albums, rootPath);
  }

  if (grants.includes(albumPath)) {
    return grants.filter((path) => path !== albumPath && !path.startsWith(`${albumPath}/`));
  }

  const ancestor = nearestStoredAncestor(albumPath, grants);
  if (ancestor) {
    const kept = siblingSubtreesToKeep(albums, rootPath, ancestor, albumPath);
    const rest = grants.filter((path) => path !== ancestor && !path.startsWith(`${ancestor}/`));
    return minimalCover([...rest, ...kept]);
  }

  return grants.filter((path) => path !== albumPath && !path.startsWith(`${albumPath}/`));
};
