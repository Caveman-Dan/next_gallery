"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/app/lib/helpers";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const ExpandingLayer = ({
  entry, // The folder's data object
  onSelect, // Callback for onSelect
  parentIsOpen, // To determine when to hide items and collapse an open list
  siblingIsSelected, // To hide an item only when a sibling has been selected
  setSiblingIsSelected,
  renderChildren, // To restrict rendering to a single layer at a time
  listHeight, // Defines the height value for the animated element
  setListHeight,
  parentsListHeight, // When closing a layer the height must be set to that of its parent
  focusedItem,
  setFocusedItem,
  parentEntry,
  root = false, // To prevent root items from being hidden in a collapsed list
}) => {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [hasBeenSelected, setHasBeenSelected] = useState(false);
  const [selectionMade, setSelectionMade] = useState(false);
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
      setIsSelected(true);
      setSectionOpen(true);
      setSiblingIsSelected(true);
    } else {
      // if not selected
      setIsSelected(false);
      if (entry.depth > focusedItem.depth) {
        setSiblingIsSelected(false);
      }
      if (entry.depth >= focusedItem.depth) {
        setSectionOpen(false);
      }
    }
  }, [entry, focusedItem, renderChildren, setSiblingIsSelected]);

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
    setHasBeenSelected(true);

    if (sectionOpen) {
      // Layer closing:
      setFocusedItem(parentEntry);
      setListHeight(parentsListHeight);
    } else {
      // Layer opening:
      setFocusedItem(entry);
      setListHeight(entry.children.length + entry.depth);
    }
  };

  const hideItem = !root && siblingIsSelected && parentIsOpen && !sectionOpen;

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
            className={`${styles.collapsingBox}${sectionOpen && isSelected ? ` ${styles.isOpenList}` : ""}`}
            style={{ ...springs }}
          >
            {entry.children.map((nextEntry) => (
              <ExpandingLayer
                key={nextEntry.id}
                entry={{ ...nextEntry, depth: entry.depth + 1 }}
                onSelect={onSelect}
                parentIsOpen={sectionOpen}
                siblingIsSelected={selectionMade}
                setSiblingIsSelected={setSelectionMade}
                renderChildren={hasBeenSelected}
                listHeight={listHeight}
                setListHeight={setListHeight}
                parentsListHeight={entry.children.length + entry.depth}
                focusedItem={focusedItem}
                setFocusedItem={setFocusedItem}
                parentEntry={entry}
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
          parentIsOpen
          siblingIsSelected={selectionMade}
          setSiblingIsSelected={setSelectionMade}
          renderChildren={true}
          listHeight={listHeight}
          setListHeight={setListHeight}
          parentsListHeight={entry.children.length}
          focusedItem={focusedItem}
          setFocusedItem={setFocusedItem}
          parentEntry={{ ...directories, depth: 0 }}
          root
        />
      ))}
    </div>
  );
};

export default Accordion;
