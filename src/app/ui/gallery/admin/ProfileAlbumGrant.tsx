"use client";

import { useRef } from "react";
import { adminReplaceProfileAlbums } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./ProfileAlbumGrant.module.scss";

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

const nodeAt = (root: DirectoryTree, albumPath: string, rootPath: string) => {
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
  const node = nodeAt(albums, albumPath, rootPath);
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

const nextAlbumPaths = (
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
    const kept = descendantsOf(albums, rootPath, ancestor).filter(
      (path) => path !== albumPath && !path.startsWith(`${albumPath}/`)
    );
    const rest = grants.filter((path) => path !== ancestor && !path.startsWith(`${ancestor}/`));
    return minimalCover([...rest, ...kept]);
  }

  return grants.filter((path) => path !== albumPath && !path.startsWith(`${albumPath}/`));
};

const ProfileAlbumGrant = ({
  profile,
  albumPath,
  albums,
  rootPath,
  onAlbumPathsChange,
}: {
  profile: AccessProfileOption;
  albumPath: string;
  albums: DirectoryTree;
  rootPath: string;
  onAlbumPathsChange: (albumPaths: string[]) => void;
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const inDb = profile.albumPaths.includes(albumPath);
  const inherited = !inDb && profile.albumPaths.some((grant) => albumPath.startsWith(`${grant}/`));
  const partial = !inDb && !inherited && profile.albumPaths.some((grant) => grant.startsWith(`${albumPath}/`));
  const checked = inDb || inherited || partial;

  if (checkboxRef.current) {
    checkboxRef.current.indeterminate = partial;
  }

  const handleChange = () => {
    const albumPaths = nextAlbumPaths(profile.albumPaths, albumPath, !checked, albums, rootPath);
    onAlbumPathsChange(albumPaths);
    void adminReplaceProfileAlbums(profile.id, albumPaths);
  };

  return (
    <div className={styles.root}>
      {" "}
      <label>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onClick={(event) => event.stopPropagation()}
        />
      </label>
    </div>
  );
};

export default ProfileAlbumGrant;
