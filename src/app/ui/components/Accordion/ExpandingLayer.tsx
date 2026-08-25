"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo, memo } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise, cropPath } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

import styles from "./Accordion.module.scss";
import { accordion as springsConfig } from "@/style/springsConfig";
import { useAccordionState } from "./AccordionContext";

import type { DirectoryEntry, EntryDetails } from "./types";

interface ExpandingLayerProps {
  entry: DirectoryEntry;
  parentEntryDetails: EntryDetails;
  renderChildren: boolean;
}

const ExpandingLayer = memo(function ExpandingLayer({
  entry,
  parentEntryDetails,
  renderChildren,
}: ExpandingLayerProps) {
  const {
    openItem,
    setOpenItem,
    listHeight,
    setListHeight,
    currentUri,
    uriParts,
    onSelect,
  } = useAccordionState();

  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [renderNextChild, setRenderNextChild] = useState(false);

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
  }, [
    currentEntryDetails,
    currentUri,
    entry.children?.length,
    entry.depth,
    entry.name,
    openItem,
    setListHeight,
    setOpenItem,
    uriParts,
  ]);

  // Handle selection from state (user clicks or after openItem is set from URL)
  useLayoutEffect(() => {
    if (!renderChildren || !openItem) return;
    if (entry.custom.id === openItem.id) {
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

  if (!renderChildren) return null;

  return (
    <>
      {!entry.children?.length ? (
        // Leaf album → Link
        <Link
          className={`${styles.link}${isSelected ? ` ${styles.selectedAlbum}` : ""}${isRootItem ? " baseItem" : ""}`}
          onClick={() => {
            handleOpenItem(currentEntryDetails);
            onSelect({ skipHistory: true });
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
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default ExpandingLayer;
