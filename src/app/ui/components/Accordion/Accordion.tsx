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
  siblingIsOpen: boolean;
  setSiblingIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  onSelect, // callback for onSelect
  siblingIsOpen, // hide items in list only when a sibling is open
  setSiblingIsOpen,
  listHeight, // universal height value for the animated elements
  setListHeight,
  focusedItem, // id & depth of focused item's entry
  setFocusedItem,
  currentUri,
}: ExpandingLayerProps) => {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [renderNextChild, setRenderNextChild] = useState(false); // tell child to render (prevent max render alert)
  const [childSiblingIsOpen, setChildSiblingIsOpen] = useState(false); // tell child when a sibling is focused so it can hide its self
  // const [isSelected, setIsSelected] = useState(false); // Show when a selection is selected.

  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  const uriComponents = currentUri?.split("/");
  const selectedEntry = decodeURIComponent(uriComponents[uriComponents.length - 1]);

  // return null;

  const handleFocus = useCallback(() => {
    setRenderNextChild(true);
    setFocusedItem(
      isSectionOpen ? { id: parentEntry.id, depth: parentEntry.depth } : { id: entry.custom.id, depth: entry.depth }
    );
  }, [entry.custom.id, entry.depth, isSectionOpen, parentEntry.depth, parentEntry.id, setFocusedItem]);

  // Handle URL if arrived from link
  useEffect(() => {
    if (!currentUri || focusedItem || !entry.children?.length) return;

    if (decodeURIComponent(uriComponents[entry.depth]) === entry.name) {
      setListHeight(entry.children?.length + entry.depth);
      setIsSectionOpen(true);
      setRenderNextChild(true);
      // if (entry.depth === uriComponents.length - 2) {
      if (entry.depth === uriComponents.length - 2) {
        // This focuses the item b4 the album and will need updating
        // when handling a URL from an image rather than an album.
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

  useEffect(() => {
    if (!renderChildren || !focusedItem) return;
    if (entry.custom.id === focusedItem.id && entry.children?.length) {
      // if in focus
      setListHeight(entry.children?.length + entry.depth);
      setIsSectionOpen(true);
      setSiblingIsOpen(true);
    } else {
      // if not in focus
      if (entry.depth >= focusedItem.depth) {
        setIsSectionOpen(false);
        setRenderNextChild(false);
      }
      if (entry.depth > focusedItem.depth) {
        setSiblingIsOpen(false);
      }
    }
  }, [
    entry.children?.length,
    entry.custom.id,
    entry.depth,
    focusedItem,
    renderChildren,
    setListHeight,
    setSiblingIsOpen,
  ]);

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

  const hideItem = entry.depth && siblingIsOpen && !isSectionOpen;
  const isOpenList = entry.custom.id === focusedItem?.id;
  const isSelected = selectedEntry === entry.name && entry.depth === uriComponents.length - 1;
  const isRootItem = entry.depth === 0;

  return (
    <>
      {!entry.children?.length ? ( // if no children
        <Link
          className={`${styles.link}${hideItem ? ` ${styles.isHidden}` : ""}${
            isSelected ? ` ${styles.isOpenLabel}` : "" // this will select an item
          }`}
          onClick={onSelect}
          href={`/gallery/album/${entry.path}`}
        >
          {capitalise(entry.name)}
          <DirectionalArrow direction="right" height="28px" colour={"var(--highlight-colour-alternate4)"} />
        </Link>
      ) : (
        <div
          className={`${styles.expandingLayerContainer}${
            isSectionOpen && isRootItem ? ` ${styles.isOpenExpandingLayer}` : ""
          }`}
        >
          <div
            className={`${styles.sectionLabel}${isSectionOpen ? ` ${styles.isOpenLabel}` : ""}${
              hideItem ? ` ${styles.isHidden}` : ""
            }`}
            onClick={handleFocus}
          >
            {capitalise(entry.name)}
            <DirectionalArrow
              direction={isSectionOpen ? "up" : "down"}
              height={"28px"}
              colour={!isSectionOpen ? "var(--highlight-colour-alternate4)" : undefined}
            />
          </div>
          <animated.div
            className={`${styles.animatedBox}${isOpenList ? ` ${styles.isOpenList}` : ""}`}
            style={{ ...springs }}
          >
            {entry.children.map((nextEntry) => (
              <ExpandingLayer
                key={nextEntry.custom.id}
                entry={{ ...JSON.parse(JSON.stringify(nextEntry)), depth: entry.depth + 1 }}
                parentEntry={{ id: entry.custom.id, depth: entry.depth }}
                renderChildren={renderNextChild}
                onSelect={onSelect}
                siblingIsOpen={childSiblingIsOpen}
                setSiblingIsOpen={setChildSiblingIsOpen}
                listHeight={listHeight}
                setListHeight={setListHeight}
                focusedItem={focusedItem}
                setFocusedItem={setFocusedItem}
                currentUri={currentUri}
              />
            ))}
          </animated.div>
        </div>
      )}
    </>
  );
};

const Accordion = ({ directories, onSelect }: { directories: GetAlbumsInterface; onSelect: () => void }) => {
  const entryPage = usePathname().split("/")[2];
  let currentUri = usePathname().replace(`/gallery/${entryPage}/`, "");
  const [childSiblingIsOpen, setChildSiblingIsOpen] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [focusedItem, setFocusedItem] = useState<PartialEntry | null>(null);

  if (entryPage === "image") currentUri = currentUri.split("/").slice(0, -1).join("/"); // Remove filename from uri

  // console.log("uri: ", { currentUri, entryPage });

  return (
    <div className={styles.root}>
      {directories.children?.map((entry) => (
        <ExpandingLayer
          key={entry.custom.id}
          entry={{ ...JSON.parse(JSON.stringify(entry)), depth: 0 }}
          parentEntry={{ id: directories.custom.id, depth: 0 }}
          renderChildren={true}
          onSelect={onSelect}
          siblingIsOpen={childSiblingIsOpen}
          setSiblingIsOpen={setChildSiblingIsOpen}
          listHeight={listHeight}
          setListHeight={setListHeight}
          focusedItem={focusedItem}
          setFocusedItem={setFocusedItem}
          currentUri={currentUri}
        />
      ))}
    </div>
  );
};

export default Accordion;
