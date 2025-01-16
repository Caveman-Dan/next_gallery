"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

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
}) => {
  const [sectionOpen, setSectionOpen] = useState(false);
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

    if (entry.id === focusedItem.id) {
      // if in focus
      setListHeight(entry.children.length + entry.depth);
      setSiblingIsOpen(true);
      setSectionOpen(true);
    } else {
      // if not in focus
      if (entry.depth >= focusedItem.depth) {
        setSectionOpen(false);
        setRenderNextChild(false);
      }
      if (entry.depth > focusedItem.depth) {
        setSiblingIsOpen(false);
      }
    }
  }, [entry.children.length, entry.depth, entry.id, focusedItem, renderChildren, setListHeight, setSiblingIsOpen]);

  useEffect(() => {
    if (!renderChildren) return;

    api.start({
      to: {
        height: sectionOpen ? `${(listHeight - entry.depth) * 2}em` : "0",
      },
      config: {
        ...springsConfig,
        clamp: !sectionOpen,
      },
    });
  }, [api, entry.depth, listHeight, renderChildren, sectionOpen]);

  if (!renderChildren) return; // Restrict rendering to avoid max render

  const handleFocus = () => {
    setRenderNextChild(true);
    setFocusedItem(
      sectionOpen ? { id: parentEntry.id, depth: parentEntry.depth } : { id: entry.id, depth: entry.depth }
    );
  };

  const hideItem = entry.depth && siblingIsOpen && !sectionOpen;
  const isFocused = entry.id === focusedItem?.id;
  const isRootLayer = entry.depth === 0;

  return (
    <>
      {!entry.children.length ? ( // if no children
        <Link
          className={`${styles.link}${hideItem ? ` ${styles.isHidden}` : ""}`}
          onClick={onSelect}
          href={`/gallery/${entry.name}`}
        >
          {capitalise(entry.name)}
          <DirectionalArrow direction="right" height="28px" colour={"var(--primary-colour-darker)"} />
        </Link>
      ) : (
        <div className={`${styles.expandingLayerContainer}`}>
          <div
            className={`${styles.sectionLabel}${sectionOpen ? ` ${styles.isOpenLabel}` : ""}${
              isFocused ? ` ${styles.isFocusedLabel}` : ""
            }${sectionOpen && isRootLayer ? ` ${styles.isOpenRootLabel}` : ""}${hideItem ? ` ${styles.isHidden}` : ""}`}
            onClick={handleFocus}
          >
            {capitalise(entry.name)}
            <DirectionalArrow
              direction={sectionOpen ? "up" : "down"}
              height={"28px"}
              colour={!sectionOpen ? "var(--primary-colour-darker)" : undefined}
            />
          </div>
          <animated.div
            className={`${styles.animatedBox}${sectionOpen && isFocused ? ` ${styles.isOpenList}` : ""}`}
            style={{ ...springs }}
          >
            {entry.children.map((nextEntry) => (
              <ExpandingLayer
                key={nextEntry.id}
                entry={{ ...nextEntry, depth: entry.depth + 1 }}
                parentEntry={{ id: entry.id, depth: entry.depth }}
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

const Accordion = ({ directories, onSelect }) => {
  const [childSiblingIsOpen, setChildSiblingIsOpen] = useState(false);
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
