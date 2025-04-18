"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

import styles from "./Accordion.module.scss";
import { accordion as springsConfig } from "@/style/springsConfig";

import type { GetAlbumsInterface } from "@/definitions/definitions";
import { getAlbums } from "@/lib/actions";

interface PartialEntry {
  id: string;
  depth: number;
}

interface DirectoryEntry extends GetAlbumsInterface {
  depth: number;
}

interface ExpandingLayerProps {
  entry: DirectoryEntry;
  parentEntry: PartialEntry;
  renderChildren: boolean;
  onSelect: () => void;
  listHeight: number;
  setListHeight: React.Dispatch<React.SetStateAction<number>>;
  focusedItem: PartialEntry | null;
  setFocusedItem: React.Dispatch<React.SetStateAction<PartialEntry | null>>;
  currentUri: string;
}

const ExpandingLayer = ({
  entry, // the folder's data object
  parentEntry, // id & depth of parent's entry
  renderChildren, // restrict rendering until parent is open
  onSelect, // callback passed in to call when a selection is made
  listHeight, // universal height value for the animated elements
  setListHeight,
  focusedItem, // id & depth of focused item's entry
  setFocusedItem,
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
  const isOpenList = entry.custom.id === focusedItem?.id;
  const isRootItem = entry.depth === 0;

  const handleFocusLink = () => {
    setRenderNextChild(true);
    setFocusedItem({ id: entry.custom.id, depth: entry.depth });
    onSelect();
  };

  const handleFocus = useCallback(() => {
    setRenderNextChild(true);
    setFocusedItem(
      isSectionOpen ? { id: parentEntry.id, depth: parentEntry.depth } : { id: entry.custom.id, depth: entry.depth }
    );
  }, [entry.custom.id, entry.depth, isSectionOpen, parentEntry.depth, parentEntry.id, setFocusedItem]);

  // Make selection from URL
  useLayoutEffect(() => {
    if (!currentUri || focusedItem) return;

    if (uriComponents[entry.depth] === entry.name) {
      if (entry.children?.length) setListHeight(entry.children?.length + entry.depth);
      setIsSectionOpen(true);
      setRenderNextChild(true);
      if (entry.depth === uriComponents.length - 2) {
        // This focuses the item b4 the album
        handleFocus();
      }
    }
  }, [
    currentUri,
    entry.children?.length,
    entry.depth,
    entry.name,
    focusedItem,
    handleFocus,
    setListHeight,
    uriComponents,
  ]);

  // Make selection from focusedItem
  useLayoutEffect(() => {
    if (!renderChildren || !focusedItem) return;
    if (entry.custom.id === focusedItem?.id) {
      // if in focus
      setIsSectionOpen(true);
      if (entry.children?.length) setListHeight(entry.children?.length + entry.depth);
    } else {
      // Close open items when when switching branch
      if (entry.depth >= focusedItem?.depth) {
        setIsSectionOpen(false);
        setRenderNextChild(false);
      }
    }
  }, [entry.children?.length, entry.custom.id, entry.depth, focusedItem, renderChildren, setListHeight]);

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
          className={`${styles.link}${isSelected ? ` ${styles.selectedAlbum}` : ""}${entry.depth ? "" : " baseItem"}`}
          onClick={handleFocusLink}
          href={`/gallery/album/${entry.path}`}
        >
          {capitalise(entry.name)}
          <DirectionalArrow direction="right" height="28px" colour={"var(--highlight-colour-alternate4)"} />
        </Link>
      ) : (
        <div
          className={`${styles.expandingLayerContainer}${
            isSectionOpen && isRootItem ? ` ${styles.isOpenExpandingLayer}` : ""
          }${isRootItem ? " baseItem" : ""}`}
        >
          <div
            className={`${styles.sectionLabel}${isSectionOpen ? ` ${styles.isOpenLabel}` : ""}`}
            onClick={handleFocus}
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
                  entry={{ ...JSON.parse(JSON.stringify(nextEntry)), depth: entry.depth + 1 }}
                  parentEntry={{ id: entry.custom.id, depth: entry.depth }}
                  renderChildren={renderNextChild}
                  onSelect={onSelect}
                  listHeight={listHeight}
                  setListHeight={setListHeight}
                  focusedItem={focusedItem}
                  setFocusedItem={setFocusedItem}
                  currentUri={currentUri}
                />
              ))}
            </animated.div>
          ) : (
            <div className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`}>
              {entry.children.map((nextEntry) => (
                <ExpandingLayer
                  key={nextEntry.custom.id}
                  entry={{ ...JSON.parse(JSON.stringify(nextEntry)), depth: entry.depth + 1 }}
                  parentEntry={{ id: entry.custom.id, depth: entry.depth }}
                  renderChildren={renderNextChild}
                  onSelect={onSelect}
                  listHeight={listHeight}
                  setListHeight={setListHeight}
                  focusedItem={focusedItem}
                  setFocusedItem={setFocusedItem}
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

const Accordion = ({ onSelect }: { onSelect: () => void }) => {
  const [albums, setAlbums] = useState<GetAlbumsInterface>();
  const entryPage = usePathname().split("/")[2];
  let currentUri = usePathname().replace(`/gallery/${entryPage}/`, "");
  const [listHeight, setListHeight] = useState(0);
  const [focusedItem, setFocusedItem] = useState<PartialEntry | null>(null);

  if (entryPage === "image") currentUri = currentUri.split("/").slice(0, -1).join("/"); // Remove filename from uri

  useLayoutEffect(() => {
    getAlbums()
      .then((data) => {
        setAlbums(data);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  if (!albums) return null;

  console.log("HERE: ", albums);

  return (
    <div className={styles.root}>
      {albums.children?.map((entry) => (
        <ExpandingLayer
          key={entry.custom.id}
          entry={{ ...JSON.parse(JSON.stringify(entry)), depth: 0 }}
          parentEntry={{ id: albums.custom.id, depth: 0 }}
          renderChildren={true}
          onSelect={onSelect}
          listHeight={listHeight}
          setListHeight={setListHeight}
          focusedItem={focusedItem}
          setFocusedItem={setFocusedItem}
          currentUri={decodeURIComponent(currentUri)}
        />
      ))}
    </div>
  );
};

export default Accordion;
