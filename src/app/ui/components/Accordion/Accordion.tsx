"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo, memo } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise, cropPath } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

import styles from "./Accordion.module.scss";
import { accordion as springsConfig } from "@/style/springsConfig";

import type { DirectoryTree } from "directory-tree";

interface EntryDetails {
  id: string;
  path: string;
  depth: number;
}

interface DirectoryEntry extends DirectoryTree {
  depth: number;
}

interface ExpandingLayerProps {
  entry: DirectoryEntry;
  parentEntryDetails: EntryDetails;
  renderChildren: boolean;
  onSelect: () => void;
  listHeight: number;
  setListHeight: React.Dispatch<React.SetStateAction<number>>;
  openItem: EntryDetails | null;
  setOpenItem: React.Dispatch<React.SetStateAction<EntryDetails | null>>;
  currentUri: string;
  uriParts: string[];
}

const ExpandingLayer = memo(function ExpandingLayer({
  entry, // the folder's data object
  parentEntryDetails, // id, path & depth of parent's entry
  renderChildren, // restrict rendering until parent is open
  onSelect, // callback to run when selection is made (close sidebar)
  listHeight, // height value for the containing animated element
  setListHeight,
  openItem, // id, path & depth of current open item
  setOpenItem,
  currentUri, // The URI used to open the menu and highlight the selection when the page is refreshed
  uriParts,
}: ExpandingLayerProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [renderNextChild, setRenderNextChild] = useState(false); // tell child to render (prevent max render fatal error)

  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0em" },
  });

  const isSelected = uriParts[uriParts.length - 1] === entry.name && entry.depth === uriParts.length - 1;
  const isOpenList = entry.custom.id === openItem?.id;
  const isRootItem = entry.depth === 0;
  const currentEntryDetails = useMemo(
    () => ({ id: entry.custom.id, path: entry.path, depth: entry.depth }),
    [entry.custom.id, entry.depth, entry.path]
  );

  const handleOpenItem = useCallback(
    (newOpenItem: EntryDetails) => {
      setRenderNextChild(true);
      setOpenItem(newOpenItem);
    },
    [setOpenItem]
  );

  // Handle selection from URL when closed menu is reset or when accessed from link / direct load
  useLayoutEffect(() => {
    if (!currentUri || openItem) return;

    if (uriParts[entry.depth] === entry.name) {
      if (entry.children?.length) {
        setListHeight(entry.children.length + entry.depth);
      }
      setIsSectionOpen(true);
      setRenderNextChild(true);
      // Set the parent of the selected album to be the current open item
      // (depth === uriParts.length - 2 means this entry is the direct parent of the leaf album)
      if (entry.depth === uriParts.length - 2) {
        setOpenItem(currentEntryDetails);
      }
    } else {
      setIsSectionOpen(false);
    }
  }, [currentEntryDetails, currentUri, entry.children?.length, entry.depth, entry.name, openItem, setListHeight, setOpenItem, uriParts]);

  // Handle selection from state (user clicks or after openItem is set from URL)
  useLayoutEffect(() => {
    if (!renderChildren || !openItem) return;
    if (entry.custom.id === openItem.id) {
      // if current open item
      setIsSectionOpen(true);
      if (entry.children?.length) {
        setListHeight(entry.children.length + entry.depth);
      }
    } else {
      // collapse items if they are on a different branch
      if (cropPath(openItem.path, entry.depth + 1) !== entry.path) {
        setIsSectionOpen(false);
        setRenderNextChild(false);
      }
    }
  }, [entry.children?.length, entry.custom.id, entry.depth, entry.path, openItem, renderChildren, setListHeight]);

  useEffect(() => {
    if (!renderChildren) return;

    api.start({
      to: {
        height: isSectionOpen ? `${(listHeight - entry.depth) * 2}em` : "0em",
      },
      config: {
        ...springsConfig,
        clamp: !isSectionOpen,
      },
    });
  }, [api, entry.depth, isSectionOpen, listHeight, renderChildren]);

  if (!renderChildren) return null; // Restrict rendering to avoid max render

  return (
    <>
      {!entry.children?.length ? ( // if no children return a link (leaf album)
        <Link
          className={`${styles.link}${isSelected ? ` ${styles.selectedAlbum}` : ""}${isRootItem ? " baseItem" : ""}`}
          onClick={() => {
            handleOpenItem(currentEntryDetails);
            setTimeout(() => onSelect(), 200); // this delay prevents the router.back() from firing b4 redirect
          }}
          href={`/gallery/album/${entry.path}`}
        >
          {capitalise(entry.name)}
          <DirectionalArrow direction="right" height="28px" colour={"var(--highlight-colour-alternate4)"} />
        </Link>
      ) : (
        <div
          className={`${styles.expandingLayerContainer}${
            isSectionOpen && isRootItem ? ` ${styles.openRootExpandingLayer}` : ""
          }${isRootItem ? " baseItem" : ""}`}
        >
          <div
            className={`${styles.sectionLabel}${isSectionOpen ? ` ${styles.isOpenLabel}` : ""}`}
            onClick={() => handleOpenItem(isSectionOpen ? parentEntryDetails : currentEntryDetails)}
          >
            {capitalise(entry.name)}
            <DirectionalArrow
              direction={isSectionOpen ? "up" : "down"}
              height={"28px"}
              colour={!isSectionOpen ? "var(--highlight-colour-alternate4)" : undefined}
            />
          </div>
          {isRootItem ? (
            <animated.div
              className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`}
              style={springs}
            >
              {entry.children.map((nextEntry) => (
                <ExpandingLayer
                  key={nextEntry.custom.id}
                  entry={{ ...nextEntry, depth: entry.depth + 1 }}
                  parentEntryDetails={{ id: entry.custom.id, path: entry.path, depth: entry.depth }}
                  renderChildren={renderNextChild}
                  onSelect={onSelect}
                  listHeight={listHeight}
                  setListHeight={setListHeight}
                  openItem={openItem}
                  setOpenItem={setOpenItem}
                  currentUri={currentUri}
                  uriParts={uriParts}
                />
              ))}
            </animated.div>
          ) : (
            <div className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`}>
              {entry.children.map((nextEntry) => (
                <ExpandingLayer
                  key={nextEntry.custom.id}
                  entry={{ ...nextEntry, depth: entry.depth + 1 }}
                  parentEntryDetails={{ id: entry.custom.id, path: entry.path, depth: entry.depth }}
                  renderChildren={renderNextChild}
                  onSelect={onSelect}
                  listHeight={listHeight}
                  setListHeight={setListHeight}
                  openItem={openItem}
                  setOpenItem={setOpenItem}
                  currentUri={currentUri}
                  uriParts={uriParts}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
});

/** Walk the tree to find the EntryDetails of the direct parent of the album identified by uriParts.
 * Returns null if the path is invalid, empty, or the album is a root-level leaf.
 */
function findOpenItemForUri(root: DirectoryTree, uriParts: string[]): EntryDetails | null {
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

const Accordion = ({
  isSidebarOpen,
  onSelect,
  albums,
}: {
  isSidebarOpen: boolean;
  onSelect: () => void;
  albums: DirectoryTree;
}) => {
  const pathname = usePathname();
  const entryPage = pathname.split("/")[2];
  let currentUri = pathname.replace(`/gallery/${entryPage}/`, "");
  if (entryPage === "image") {
    currentUri = currentUri.split("/").slice(0, -1).join("/"); // Remove filename from uri
  }
  currentUri = decodeURIComponent(currentUri);

  const uriParts = useMemo(() => (currentUri ? currentUri.split("/").filter(Boolean) : []), [currentUri]);

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
      setOpenItem(initial);
      // Seed a reasonable listHeight so the root spring has a target immediately
      // (the ExpandingLayer effects will refine it with the real children.length).
      setListHeight(initial.depth + 4);
    }
  }, [albums, openItem, uriParts]);

  if (!albums?.children?.length) return null;

  return (
    <div className={styles.root}>
      {albums.children.map((entry) => (
        <ExpandingLayer
          key={entry.custom.id}
          entry={{ ...entry, depth: 0 }}
          parentEntryDetails={{ id: albums.custom.id, path: albums.path, depth: -1 }}
          renderChildren={true}
          onSelect={onSelect}
          listHeight={listHeight}
          setListHeight={setListHeight}
          openItem={openItem}
          setOpenItem={setOpenItem}
          currentUri={currentUri}
          uriParts={uriParts}
        />
      ))}
    </div>
  );
};

export default Accordion;
