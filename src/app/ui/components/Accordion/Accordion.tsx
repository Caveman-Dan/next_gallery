"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

import styles from "./Accordion.module.scss";
import { accordion as springsConfig } from "@/style/springsConfig";

import type { DirectoryTree } from "directory-tree";
import { getAlbums } from "@/lib/actions";
import { cropPath } from "@/lib/helpers";

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
}

const ExpandingLayer = ({
  entry, // the folder's data object
  parentEntryDetails, // id, path & depth of parent's entry
  renderChildren, // restrict rendering until parent is open
  listHeight, // height value for the containing animated element
  onSelect, // callback to run when selection is made (close sidebar)
  setListHeight,
  openItem, // id, path & depth of current open item
  setOpenItem,
  currentUri, // The URI components used to open the menu and highlight the selection when the page is refreshed
}: ExpandingLayerProps) => {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [renderNextChild, setRenderNextChild] = useState(false); // tell child to render (prevent max render fatal error)

  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  const uriComponents = currentUri?.split("/");
  const uriBasename = uriComponents[uriComponents.length - 1];
  const isSelected = uriBasename === entry.name && entry.depth === uriComponents.length - 1;
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

  // Make selection from URL when closed menu is reset or when accessed from link
  useLayoutEffect(() => {
    if (!currentUri || openItem) return;

    if (uriComponents[entry.depth] === entry.name) {
      if (entry.children?.length) setListHeight(entry.children?.length + entry.depth);
      setIsSectionOpen(true);
      setRenderNextChild(true);
      if (entry.depth === uriComponents.length - 2) {
        // This sets the parent of the selected album to be the current open item
        setOpenItem(currentEntryDetails);
      }
    } else {
      setIsSectionOpen(false);
    }
  }, [
    currentEntryDetails,
    currentUri,
    entry.children?.length,
    entry.depth,
    entry.name,
    openItem,
    setListHeight,
    setOpenItem,
    uriComponents,
  ]);

  // Handle selection from state
  useLayoutEffect(() => {
    if (!renderChildren || !openItem) return;
    if (entry.custom.id === openItem?.id) {
      // if current open item
      setIsSectionOpen(true);
      if (entry.children?.length) setListHeight(entry.children?.length + entry.depth);
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
        height: isSectionOpen ? `${(listHeight - entry.depth) * 2}em` : "0",
      },
      config: {
        ...springsConfig,
        clamp: !isSectionOpen,
      },
    });
  }, [api, entry.depth, isSectionOpen, listHeight, renderChildren]);

  if (!renderChildren) return; // Restrict rendering to avoid max render

  return (
    <>
      {!entry.children?.length ? ( // if no children return a link
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
              style={{ ...springs }}
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
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

const Accordion = ({ isSidebarOpen, onSelect }: { isSidebarOpen: boolean; onSelect: (newState?: boolean) => void }) => {
  const [albums, setAlbums] = useState<DirectoryTree>();
  const [accordionKey, setAccordionKey] = useState(isSidebarOpen.toString());
  const entryPage = usePathname().split("/")[2];
  let currentUri = usePathname().replace(`/gallery/${entryPage}/`, "");
  const [listHeight, setListHeight] = useState(0);
  const [openItem, setOpenItem] = useState<EntryDetails | null>(null);

  if (entryPage === "image") currentUri = currentUri.split("/").slice(0, -1).join("/"); // Remove filename from uri

  // Renew React component key to trigger re-render
  const resetMenu = useCallback(() => {
    setAccordionKey(isSidebarOpen.toString());
    setOpenItem(null);
    setListHeight(0);
  }, [isSidebarOpen]);

  useLayoutEffect(() => {
    getAlbums()
      .then((data) => {
        setAlbums(data);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  // Reset Accordion on close
  useLayoutEffect(() => {
    if (isSidebarOpen) return;
    setTimeout(() => resetMenu(), 400);
  }, [resetMenu, isSidebarOpen]);

  if (!albums) return null;

  return (
    <div className={styles.root} key={accordionKey}>
      {albums.children?.map((entry) => (
        <ExpandingLayer
          key={entry.custom.id}
          entry={{ ...entry, depth: 0 }}
          parentEntryDetails={{ id: albums.custom.id, path: albums.path, depth: 0 }}
          renderChildren={true}
          onSelect={onSelect}
          listHeight={listHeight}
          setListHeight={setListHeight}
          openItem={openItem}
          setOpenItem={setOpenItem}
          currentUri={decodeURIComponent(currentUri)}
        />
      ))}
    </div>
  );
};

export default Accordion;
