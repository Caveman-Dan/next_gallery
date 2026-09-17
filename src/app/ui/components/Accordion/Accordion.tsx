"use client";

import { usePathname } from "next/navigation";
import React, { useState, useCallback, useMemo } from "react";

import Button from "@/ui/components/Button/Button";
import ExpandingLayer from "./ExpandingLayer";
import { AccordionProvider } from "./AccordionContext";
import { findOpenItemForUri, getActivePathFromPathname, getLeafHref, isImageRoute } from "./helpers";

import styles from "./Accordion.module.scss";

import type { DirectoryTree } from "directory-tree";
import type { EntryDetails, AccordionState, AccordionRoutes } from "./types";

interface AccordionProps {
  isSidebarOpen?: boolean;
  onSelect?: (options?: { skipHistory?: boolean }) => void;
  albums?: DirectoryTree;
  routes?: AccordionRoutes;
  renderLeaf?: AccordionState["renderLeaf"];
  renderFolderLabel?: AccordionState["renderFolderLabel"];
  showExpandControls?: boolean;
}

const Accordion = ({
  isSidebarOpen = true,
  onSelect = () => undefined,
  albums,
  routes,
  renderLeaf,
  renderFolderLabel,
  showExpandControls = false,
}: AccordionProps) => {
  const pathname = usePathname();
  const currentUri = useMemo(() => (routes ? getActivePathFromPathname(pathname, routes) : ""), [pathname, routes]);
  const uriParts = useMemo(() => (currentUri ? currentUri.split("/").filter(Boolean) : []), [currentUri]);
  const isViewingImage = useMemo(() => (routes ? isImageRoute(pathname, routes) : false), [pathname, routes]);
  const getItemHref = useCallback((path: string) => (routes ? getLeafHref(path, routes) : path), [routes]);
  const [expandMode, setExpandMode] = useState<AccordionState["expandMode"]>("manual");

  const urlOpenItem = useMemo(() => (albums ? findOpenItemForUri(albums, uriParts) : null), [albums, uriParts]);

  const [clickedItem, setClickedItem] = useState<EntryDetails | null>(null);
  const [clickedForUri, setClickedForUri] = useState<string | null>(null);
  const [listHeight, setListHeight] = useState(0);
  const [resetForPath, setResetForPath] = useState(pathname);
  const [wasSidebarOpen, setWasSidebarOpen] = useState(isSidebarOpen);

  // Only clear click state when the route changes (e.g. /gallery → UserProfile).
  // Do not clear on every render while still on /gallery or folders never stay open.
  if (resetForPath !== pathname) {
    setResetForPath(pathname);
    if (!routes || !getActivePathFromPathname(pathname, routes)) {
      setClickedItem(null);
      setClickedForUri(null);
      setListHeight(0);
      setExpandMode("manual");
    }
  }

  // Closing the sidebar drops explore clicks so openItem falls back to the URL.
  // Do not zero listHeight here or the current album section collapses to root.
  if (wasSidebarOpen !== isSidebarOpen) {
    setWasSidebarOpen(isSidebarOpen);
    if (!isSidebarOpen) {
      setClickedItem(null);
      setClickedForUri(null);
      setExpandMode("manual");
    }
  }

  const openItem = clickedForUri === currentUri && clickedItem ? clickedItem : urlOpenItem;

  const setOpenItem = useCallback(
    (item: EntryDetails | null) => {
      setClickedItem(item);
      setClickedForUri(currentUri);
    },
    [currentUri]
  );

  const expandAll = () => {
    setExpandMode("all");
  };

  const collapseAll = () => {
    setExpandMode("none");
    setOpenItem(null);
    setListHeight(0);
  };

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
      renderLeaf,
      renderFolderLabel,
      expandMode,
      setExpandMode,
    }),
    [
      openItem,
      setOpenItem,
      listHeight,
      currentUri,
      uriParts,
      onSelect,
      isViewingImage,
      getItemHref,
      renderLeaf,
      renderFolderLabel,
      expandMode,
    ]
  );

  if (!albums?.children?.length) return null;

  return (
    <AccordionProvider value={state}>
      <div className={`${styles.root}${expandMode === "all" ? ` ${styles.showAll}` : ""}`}>
        {showExpandControls && (
          <div className={styles.expandControls}>
            <div className={styles.expandButton}>
              <Button type="button" onClick={expandAll}>
                Expand all
              </Button>
            </div>
            <div className={styles.expandButton}>
              <Button type="button" onClick={collapseAll}>
                Collapse all
              </Button>
            </div>
          </div>
        )}
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
