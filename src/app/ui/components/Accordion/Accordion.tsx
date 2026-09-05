"use client";

import { usePathname } from "next/navigation";
import React, { useState, useCallback, useMemo } from "react";

import styles from "./Accordion.module.scss";
import ExpandingLayer from "./ExpandingLayer";
import { AccordionProvider } from "./AccordionContext";
import { findOpenItemForUri, getActivePathFromPathname, getLeafHref, isImageRoute } from "./helpers";

import type { DirectoryTree } from "directory-tree";
import type { EntryDetails, AccordionState, AccordionRoutes } from "./types";

interface AccordionProps {
  isSidebarOpen?: boolean;
  onSelect: (options?: { skipHistory?: boolean }) => void;
  albums?: DirectoryTree;
  routes: AccordionRoutes;
}

const Accordion = ({ onSelect, albums, routes }: AccordionProps) => {
  const pathname = usePathname();
  const currentUri = useMemo(() => getActivePathFromPathname(pathname, routes), [pathname, routes]);
  const uriParts = useMemo(() => (currentUri ? currentUri.split("/").filter(Boolean) : []), [currentUri]);
  const isViewingImage = useMemo(() => isImageRoute(pathname, routes), [pathname, routes]);
  const getItemHref = useCallback((path: string) => getLeafHref(path, routes), [routes]);

  const urlOpenItem = useMemo(() => (albums ? findOpenItemForUri(albums, uriParts) : null), [albums, uriParts]);

  const [clickedItem, setClickedItem] = useState<EntryDetails | null>(null);
  const [clickedForUri, setClickedForUri] = useState<string | null>(null);
  const [listHeight, setListHeight] = useState(0);

  const openItem = clickedForUri === currentUri && clickedItem ? clickedItem : urlOpenItem;

  const setOpenItem = useCallback(
    (item: EntryDetails | null) => {
      setClickedItem(item);
      setClickedForUri(currentUri);
    },
    [currentUri]
  );

  const state: AccordionState = useMemo(
    () => ({
      openItem,
      setOpenItem,
      listHeight,
      setListHeight,
      currentUri,
      uriParts,
      isViewingImage,
      onSelect,
      getItemHref,
    }),
    [openItem, setOpenItem, listHeight, currentUri, uriParts, onSelect, isViewingImage, getItemHref]
  );

  if (!albums?.children?.length) return null;

  return (
    <AccordionProvider value={state}>
      <div className={styles.root}>
        {albums.children.map((entry) => (
          <ExpandingLayer
            key={entry.path}
            entry={{ ...entry, depth: 0 }}
            parentEntryDetails={{ path: albums.path, depth: -1 }}
            renderChildren={true}
          />
        ))}
      </div>
    </AccordionProvider>
  );
};

export default Accordion;
