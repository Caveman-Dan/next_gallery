import { joinPath } from "@/lib/helpers";

import type { DirectoryTree } from "directory-tree";
import type { EntryDetails, AccordionRoutes } from "./types";

/**
 * Walk the tree to find the EntryDetails of the direct parent of the album
 * identified by uriParts.
 * Returns null if the path is invalid, empty, or the album is a root-level leaf.
 */
export function findOpenItemForUri(root: DirectoryTree, uriParts: string[]): EntryDetails | null {
  if (!uriParts.length || !root.children?.length) return null;

  // If only one part, it's a root-level album → no expandable parent to open
  if (uriParts.length === 1) return null;

  let current: DirectoryTree = root;
  let depth = -1;

  // Walk to the parent of the leaf (stop one short of the final part)
  for (let i = 0; i < uriParts.length - 1; i++) {
    const child = current.children?.find((c) => c.name === uriParts[i]);
    if (!child) return null;
    current = child;
    depth = i;
  }

  // current is now the parent folder of the selected album
  return {
    path: current.path,
    depth,
  };
}

// Derive the tree-relative path of the current page from the browser pathname
// and the accordion's route config. */
export function getActivePathFromPathname(pathname: string, routes: AccordionRoutes): string {
  const { basePath, leafSlug, assetSlug } = routes;
  const leafPrefix = `/${joinPath(basePath, leafSlug)}/`;
  const assetPrefix = assetSlug ? `/${joinPath(basePath, assetSlug)}/` : null;

  let remainder = "";
  let isAssetPage = false;

  if (assetPrefix && pathname.startsWith(assetPrefix)) {
    remainder = pathname.slice(assetPrefix.length);
    isAssetPage = true;
  } else if (pathname.startsWith(leafPrefix)) {
    remainder = pathname.slice(leafPrefix.length);
  } else {
    return "";
  }

  remainder = decodeURIComponent(remainder);
  if (isAssetPage) {
    remainder = remainder.split("/").slice(0, -1).join("/");
  }
  return remainder;
}

/** Build the href for a leaf folder using the route config. */
export function getLeafHref(entryPath: string, routes: AccordionRoutes): string {
  return `/${joinPath(routes.basePath, routes.leafSlug, entryPath)}`;
}
