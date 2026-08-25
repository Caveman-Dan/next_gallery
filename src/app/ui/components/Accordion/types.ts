import type { Dispatch, SetStateAction } from "react";
import type { DirectoryTree } from "directory-tree";

export interface EntryDetails {
  id: string;
  path: string;
  depth: number;
}

export interface DirectoryEntry extends DirectoryTree {
  depth: number;
}

/** Shared accordion state that every ExpandingLayer needs */
export interface AccordionState {
  openItem: EntryDetails | null;
  setOpenItem: (item: EntryDetails | null) => void;
  listHeight: number;
  setListHeight: Dispatch<SetStateAction<number>>;
  currentUri: string;
  uriParts: string[];
  onSelect: (options?: { skipHistory?: boolean }) => void;
}
