"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/app/lib/helpers";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const ExpandingLayer = ({
  entry, // the folder's data object
  onSelect, // callback for onSelect
  siblingIsSelected, // hide items in list only when a sibling has been selected
  setSiblingIsSelected,
  renderChildren, // restrict rendering until parent has been selected
  listHeight, // height value for the animated element
  setListHeight,
  focusedItem, // id & depth of focused item's entry
  setFocusedItem,
  parentEntry, // id & depth of parent's entry
  root = false, // To prevent root items from being hidden
}) => {
  const [sectionOpen, setSectionOpen] = useState(false); // when an item is open but not focused
  const [isFocused, setIsFocused] = useState(false); // when a item is focused and open
  const [hasBeenFocused, setHasBeenFocused] = useState(false); // when focused trigger rendering in next closure
  const [selectionMade, setSelectionMade] = useState(false); // identify when a sibling is selected
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  useLayoutEffect(() => {
    if (!renderChildren) return;
    if (!entry) return;
    if (!focusedItem) return;

    if (entry.id === focusedItem.id) {
      // if selected
      setIsFocused(true);
      setSectionOpen(true);
      setSiblingIsSelected(true);
      setListHeight(entry.children.length + entry.depth);
    } else {
      // if not selected
      setIsFocused(false);
      if (entry.depth > focusedItem.depth) {
        setSiblingIsSelected(false);
      }
      if (entry.depth >= focusedItem.depth) {
        setSectionOpen(false);
      }
    }
  }, [entry, focusedItem, renderChildren, setListHeight, setSiblingIsSelected]);

  useEffect(() => {
    if (!renderChildren) return;
    if (!entry) return;

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

  const hideItem = !root && siblingIsSelected && !sectionOpen;

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
                onSelect={onSelect}
                siblingIsSelected={selectionMade}
                setSiblingIsSelected={setSelectionMade}
                renderChildren={hasBeenFocused}
                listHeight={listHeight}
                setListHeight={setListHeight}
                focusedItem={focusedItem}
                setFocusedItem={setFocusedItem}
                parentEntry={{ id: entry.id, depth: entry.depth }}
              />
            ))}
          </animated.div>
        </div>
      )}
    </>
  );
};

const Accordion = ({ directories, onSelect }) => {
  const [selectionMade, setSelectionMade] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [focusedItem, setFocusedItem] = useState(null);

  return (
    <div className={styles.root}>
      {directories.children.map((entry) => (
        <ExpandingLayer
          key={entry.id}
          entry={{ ...entry, depth: 0 }}
          onSelect={onSelect}
          siblingIsSelected={selectionMade}
          setSiblingIsSelected={setSelectionMade}
          renderChildren={true}
          listHeight={listHeight}
          setListHeight={setListHeight}
          focusedItem={focusedItem}
          setFocusedItem={setFocusedItem}
          parentEntry={{ id: directories.id, depth: 0 }}
          root
        />
      ))}
    </div>
  );
};

export default Accordion;
