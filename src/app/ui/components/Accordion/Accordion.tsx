"use client";

import { usePathname } from "next/navigation";
import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";

import styles from "./Accordion.module.scss";
import ExpandingLayer from "./ExpandingLayer";
import { AccordionProvider } from "./AccordionContext";
import { findOpenItemForUri, getActivePathFromPathname, getLeafHref } from "./helpers";

import type { DirectoryTree } from "directory-tree";
import type { EntryDetails, AccordionState, AccordionRoutes } from "./types";

interface AccordionProps {
  isSidebarOpen: boolean;
  onSelect: (options?: { skipHistory?: boolean }) => void;
  albums: DirectoryTree;
  routes: AccordionRoutes;
}

const Accordion = ({ isSidebarOpen, onSelect, albums, routes }: AccordionProps) => {
  const pathname = usePathname();
  // const entryPage = pathname.split("/")[2];

  const currentUri = useMemo(() => getActivePathFromPathname(pathname, routes), [pathname, routes]);

  const uriParts = useMemo(() => (currentUri ? currentUri.split("/").filter(Boolean) : []), [currentUri]);

  const getItemHref = useCallback((path: string) => getLeafHref(path, routes), [routes]);

  const [listHeight, setListHeight] = useState(0);
  const [openItem, setOpenItem] = useState<EntryDetails | null>(null);

  // Reset open state when sidebar closes so the next open restores from the current URL
  const resetMenu = useCallback(() => {
    setOpenItem(null);
    setListHeight(0);
  }, []);

  useLayoutEffect(() => {
    if (isSidebarOpen) return;
    const timerReset = setTimeout(resetMenu, 400); // delay is to allow menu to close before resetting
    return () => clearTimeout(timerReset);
  }, [resetMenu, isSidebarOpen]);

  // On mount / when URI changes and openItem has been reset, seed the openItem from the URL.
  // This guarantees the correct branch is marked open even before the recursive layers run their effects
  // (critical for direct URL loads of a nested gallery).
  useLayoutEffect(() => {
    if (openItem || !uriParts.length || !albums) return;
    const initial = findOpenItemForUri(albums, uriParts);
    if (initial) {
      // Seed from the URL after a sidebar reset / first paint.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenItem(initial);
      // Seed a reasonable listHeight so the root spring has a target immediately
      // (the ExpandingLayer effects will refine it with the real children.length).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setListHeight(initial.depth + 4);
    }
  }, [albums, openItem, uriParts]);

  const state: AccordionState = useMemo(
    () => ({
      openItem,
      setOpenItem,
      listHeight,
      setListHeight,
      currentUri,
      uriParts,
      onSelect,
      getItemHref,
    }),
    [openItem, listHeight, currentUri, uriParts, onSelect, getItemHref]
  );

  if (!albums?.children?.length) return null;

  return (
    <AccordionProvider value={state}>
      <div className={styles.root}>
        {albums.children.map((entry) => (
          <ExpandingLayer
            key={entry.custom?.id}
            entry={{ ...entry, depth: 0 }}
            parentEntryDetails={{ id: albums.custom?.id, path: albums.path, depth: -1 }}
            renderChildren={true}
          />
        ))}
      </div>
    </AccordionProvider>
  );
};

export default Accordion;