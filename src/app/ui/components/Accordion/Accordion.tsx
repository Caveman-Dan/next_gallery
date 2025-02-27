"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

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
}: ExpandingLayerProps) => {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [renderNextChild, setRenderNextChild] = useState(false); // tell child to render (prevent max render)
  const [childSiblingIsOpen, setChildSiblingIsOpen] = useState(false); // tell child when a sibling is focused so it can hide its self

  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  useLayoutEffect(() => {
    if (!renderChildren) return;
    if (!focusedItem) return;

    if (entry.custom.id === focusedItem.id && entry.children?.length) {
      // if in focus
      setListHeight(entry.children?.length + entry.depth);
      setSiblingIsOpen(true);
      setIsSectionOpen(true);
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
    entry.depth,
    entry.custom.id,
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
  }, [api, entry.depth, listHeight, renderChildren, isSectionOpen]);

  if (!renderChildren) return; // Restrict rendering to avoid max render

  const handleFocus = () => {
    setRenderNextChild(true);
    setFocusedItem(
      isSectionOpen ? { id: parentEntry.id, depth: parentEntry.depth } : { id: entry.custom.id, depth: entry.depth }
    );
  };

  const hideItem = entry.depth && siblingIsOpen && !isSectionOpen;
  const isFocused = entry.custom.id === focusedItem?.id;
  const isRootItem = entry.depth === 0;

  return (
    <>
      {!entry.children?.length ? ( // if no children
        <Link
          className={`${styles.link}${hideItem ? ` ${styles.isHidden}` : ""}`}
          onClick={onSelect}
          href={`/gallery/${entry.path}`}
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
            className={`${styles.animatedBox}${isFocused ? ` ${styles.isOpenList}` : ""}`}
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
              />
            ))}
          </animated.div>
        </div>
      )}
    </>
  );
};

const Accordion = ({ directories, onSelect }: { directories: GetAlbumsInterface; onSelect: () => void }) => {
  const [childSiblingIsOpen, setChildSiblingIsOpen] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [focusedItem, setFocusedItem] = useState<PartialEntry | null>(null);

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
        />
      ))}
    </div>
  );
};

export default Accordion;
