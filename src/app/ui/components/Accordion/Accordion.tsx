"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/app/lib/helpers";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const ExpandingLayer = ({
  entry, // the folder's data object
  parentEntry, // id & depth of parent's entry
  renderChildren, // restrict rendering until parent has been focused
  onSelect, // callback for onSelect
  siblingIsFocused, // hide items in list only when a sibling has been focused
  setSiblingIsFocused,
  listHeight, // height value for the animated element
  setListHeight,
  focusedItem, // id & depth of focused item's entry
  setFocusedItem,
}) => {
  const [sectionOpen, setSectionOpen] = useState(false); // distinguish between open and open and focused
  const [hasBeenFocused, setHasBeenFocused] = useState(false); // when focused trigger rendering in next closure
  const [siblingItemFocused, setSiblingItemFocused] = useState(false); // when a sibling is focused hide item

  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  useLayoutEffect(() => {
    if (!renderChildren) return;
    if (!focusedItem) return;

    if (entry.id === focusedItem.id) {
      // if selected
      setListHeight(entry.children.length + entry.depth);
      setSiblingIsFocused(true);
      setSectionOpen(true);
    } else {
      // if not selected
      if (entry.depth > focusedItem.depth) {
        setSiblingIsFocused(false);
      }
      if (entry.depth >= focusedItem.depth) {
        setSectionOpen(false);
      }
    }
  }, [entry, focusedItem, renderChildren, setListHeight, setSiblingIsFocused]);

  useEffect(() => {
    if (!renderChildren) return;

    api.start({
      to: {
        height: sectionOpen ? `${(listHeight - entry.depth) * 1.5}em` : "0",
      },
      config: {
        ...springsConfig,
        clamp: !sectionOpen,
      },
    });
  }, [api, entry, listHeight, renderChildren, sectionOpen]);

  if (!renderChildren) return; // Restrict rendering to avoid max render

  const handleExpand = () => {
    setHasBeenFocused(true);
    setFocusedItem(
      sectionOpen ? { id: parentEntry.id, depth: parentEntry.depth } : { id: entry.id, depth: entry.depth }
    );
  };

  const hideItem = entry.depth && siblingIsFocused && !sectionOpen;
  const isFocused = entry.id === focusedItem?.id;

  return (
    <>
      {!entry.children.length ? (
        <Link className={`${hideItem ? ` ${styles.isHidden}` : ""}`} onClick={onSelect} href={`/gallery/${entry.name}`}>
          {capitalise(entry.name)}
        </Link>
      ) : (
        <div
          className={`${styles.expandingLayerContainer}
          `}
        >
          <div
            className={`${styles.sectionName}${sectionOpen ? ` ${styles.isOpenLabel}` : ""}${
              hideItem ? ` ${styles.isHidden}` : ""
            }`}
            onClick={handleExpand}
          >
            {capitalise(entry.name)}
          </div>
          <animated.div
            className={`${styles.collapsingBox}${sectionOpen && isFocused ? ` ${styles.isOpenList}` : ""}`}
            style={{ ...springs }}
          >
            {entry.children.map((nextEntry) => (
              <ExpandingLayer
                key={nextEntry.id}
                entry={{ ...nextEntry, depth: entry.depth + 1 }}
                parentEntry={{ id: entry.id, depth: entry.depth }}
                renderChildren={hasBeenFocused}
                onSelect={onSelect}
                siblingIsFocused={siblingItemFocused}
                setSiblingIsFocused={setSiblingItemFocused}
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

const Accordion = ({ directories, onSelect }) => {
  const [siblingItemFocused, setSiblingItemFocused] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [focusedItem, setFocusedItem] = useState(null);

  return (
    <div className={styles.root}>
      {directories.children.map((entry) => (
        <ExpandingLayer
          key={entry.id}
          entry={{ ...entry, depth: 0 }}
          parentEntry={{ id: directories.id, depth: 0 }}
          renderChildren={true}
          onSelect={onSelect}
          siblingIsFocused={siblingItemFocused}
          setSiblingIsFocused={setSiblingItemFocused}
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
