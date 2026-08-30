"use client";

import React, { useState, useLayoutEffect, useCallback, useMemo, memo } from "react";

import { cropPath } from "@/lib/helpers";
import { useAccordionState } from "./AccordionContext";
import { useSectionSpring } from "./useSectionSpring";
import AlbumLink from "./AlbumLink";
import FolderSection from "./FolderSection";

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
  const { openItem, setOpenItem, listHeight, setListHeight, currentUri, uriParts, onSelect, getItemHref } =
    useAccordionState();

  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [renderNextChild, setRenderNextChild] = useState(false);

  const isSelected = uriParts[uriParts.length - 1] === entry.name && entry.depth === uriParts.length - 1;
  const isOpenList = entry.path === openItem?.path;
  const isRootItem = entry.depth === 0;
  const isLeaf = !entry.children?.length;

  const currentEntryDetails = useMemo(
    () => ({ path: entry.path, depth: entry.depth }),
    [entry.depth, entry.path]
  );

  const handleOpenItem = useCallback(
    (newOpenItem: EntryDetails) => {
      setRenderNextChild(true);
      setOpenItem(newOpenItem);
    },
    [setOpenItem]
  );

  // Spring only needed for root-level animated sections
  const springs = useSectionSpring(isSectionOpen, listHeight, entry.depth, renderChildren && isRootItem);

  // Handle selection from URL when closed menu is reset or when accessed from link / direct load
  useLayoutEffect(() => {
    if (!currentUri || openItem) return;

    if (uriParts[entry.depth] === entry.name) {
      if (entry.children?.length) {
        setListHeight(entry.children.length + entry.depth);
      }
      setIsSectionOpen(true);
      setRenderNextChild(true);
      // depth === uriParts.length - 2 → this entry is the direct parent of the leaf album
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

    if (entry.path === openItem.path) {
      setIsSectionOpen(true);
      setRenderNextChild(true);
      if (entry.children?.length) {
        setListHeight(entry.children.length + entry.depth);
      }
    } else if (cropPath(openItem.path, entry.depth + 1) === entry.path) {
      // ancestor of the open folder — keep this branch mounted
      setIsSectionOpen(true);
      setRenderNextChild(true);
    } else {
      setIsSectionOpen(false);
      setRenderNextChild(false);
    }
  }, [entry.children?.length, entry.depth, entry.path, openItem, renderChildren, setListHeight]);

  if (!renderChildren) return null;

  if (isLeaf) {
    return (
      <AlbumLink
        name={entry.name}
        href={getItemHref(entry.path)}
        isSelected={isSelected}
        isRootItem={isRootItem}
        entryDetails={currentEntryDetails}
        onOpen={handleOpenItem}
        onSelect={onSelect}
      />
    );
  }

  return (
    <FolderSection
      name={entry.name}
      isSectionOpen={isSectionOpen}
      isOpenList={isOpenList}
      isRootItem={isRootItem}
      springs={springs}
      onToggle={() => handleOpenItem(isSectionOpen ? parentEntryDetails : currentEntryDetails)}
    >
      {entry.children!.map((nextEntry) => (
        <ExpandingLayer
          key={nextEntry.path}
          entry={{ ...nextEntry, depth: entry.depth + 1 }}
          parentEntryDetails={{ path: entry.path, depth: entry.depth }}
          renderChildren={renderNextChild}
        />
      ))}
    </FolderSection>
  );
});

export default ExpandingLayer;