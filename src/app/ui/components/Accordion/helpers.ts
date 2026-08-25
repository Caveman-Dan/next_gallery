import type { DirectoryTree } from "directory-tree";
import type { EntryDetails } from "./types";

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
    id: (current.custom as { id: string }).id,
    path: current.path,
    depth,
  };
}
