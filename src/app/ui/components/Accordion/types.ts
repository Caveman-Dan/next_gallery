import type { Dispatch, SetStateAction } from "react";
import type { DirectoryTree } from "directory-tree";

export interface EntryDetails {
  path: string;
  depth: number;
}

export interface DirectoryEntry extends DirectoryTree {
  depth: number;
}

// Shared accordion state that every ExpandingLayer needs
export interface AccordionState {
  openItem: EntryDetails | null;
  setOpenItem: (item: EntryDetails | null) => void;
  listHeight: number;
  setListHeight: Dispatch<SetStateAction<number>>;
  currentUri: string;
  uriParts: string[];
  onSelect: (options?: { skipHistory?: boolean }) => void;
  getItemHref: (path: string) => string;
}

// Route scheme used by the accordion to open from a URL and build leaf links.
export interface AccordionRoutes {
  // Route prefix, e.g. "/gallery"
  basePath: string;
  // Slug for a leaf folder page, e.g. "album" → /gallery/album/...
  leafSlug: string;
  /* Optional slug for a link to a single-item, e.g. "image" in "[image]/single_item.jpg"
   * Only used to recognise that URL and strip the filename so the parent leaf stays highlighted.
   * Clickable accordion leaves use leafSlug, not this. */
  assetSlug?: string;
}
