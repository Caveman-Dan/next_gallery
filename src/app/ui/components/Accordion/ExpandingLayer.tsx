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
  const {
    openItem,
    setOpenItem,
    listHeight,
    setListHeight,
    currentUri,
    uriParts,
    onSelect,
    getItemHref,
    renderLeaf,
    renderFolderLabel,
    expandMode,
    setExpandMode,
  } = useAccordionState();

  const [isSectionOpen, setIsSectionOpen] = useState(expandMode === "all");
  const [renderNextChild, setRenderNextChild] = useState(expandMode === "all");

  const isSelected = uriParts[uriParts.length - 1] === entry.name && entry.depth === uriParts.length - 1;
  const isOpenList = entry.path === openItem?.path;
  const isRootItem = entry.depth === 0;
  const isLeaf = !entry.children?.length;

  const currentEntryDetails = useMemo(() => ({ path: entry.path, depth: entry.depth }), [entry.depth, entry.path]);

  const handleOpenItem = useCallback(
    (newOpenItem: EntryDetails) => {
      setExpandMode("manual");
      setRenderNextChild(true);
      setOpenItem(newOpenItem);
    },
    [setExpandMode, setOpenItem]
  );

  const handleToggle = () => handleOpenItem(isSectionOpen ? parentEntryDetails : currentEntryDetails);

  // Spring only needed for root-level animated sections in manual mode.
  // Expand-all uses height: auto — listHeight * 2em makes the box huge.
  const springs = useSectionSpring(
    isSectionOpen,
    listHeight,
    entry.depth,
    renderChildren && isRootItem && expandMode === "manual"
  );

  useLayoutEffect(() => {
    if (expandMode === "manual") return;
    const expand = expandMode === "all";
    setIsSectionOpen(expand);
    setRenderNextChild(expand);
  }, [expandMode]);

  // Handle selection from URL when closed menu is reset or when accessed from link / direct load
  useLayoutEffect(() => {
    if (expandMode !== "manual") return;
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
    expandMode,
    openItem,
    setListHeight,
    setOpenItem,
    uriParts,
  ]);

  // Handle selection from state (user clicks or after openItem is set from URL)
  useLayoutEffect(() => {
    if (expandMode !== "manual") return;
    if (!renderChildren) return;
    if (!openItem) {
      if (!currentUri) {
        setIsSectionOpen(false);
        setRenderNextChild(false);
      }
      return;
    }

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
  }, [
    currentUri,
    entry.children?.length,
    entry.depth,
    entry.path,
    expandMode,
    openItem,
    renderChildren,
    setListHeight,
  ]);

  if (!renderChildren) return null;

  if (isLeaf) {
    const leafProps = {
      entry,
      isSelected,
      isRootItem,
      entryDetails: currentEntryDetails,
      onOpen: handleOpenItem,
      onSelect,
      getItemHref,
    };
    if (renderLeaf) return renderLeaf(leafProps);
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
      animateHeight={expandMode === "manual"}
      onToggle={handleToggle}
      labelStart={renderFolderLabel?.({
        entry,
        isSectionOpen,
        isRootItem,
        onToggle: handleToggle,
      })}
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
