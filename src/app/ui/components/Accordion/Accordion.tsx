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
  stateDispatchArray, // Array of stateDispatch functions for each closure
  setStateDispatchArray,
  parentId, // To select parent when closing a layer
  parentIsOpen, // To determine when to hide items and collapse an open list
  siblingIsSelected, // To hide an item only when a sibling has been selected
  setSiblingIsSelected,
  renderChildren, // To restrict rendering to a single layer at a time
  listHeight, // Defines the height value for the animated element
  setListHeight,
  parentsListHeight, // When closing a layer the height must be set to that of its parent
  depth, // To determine which layers to close
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
    if (stateDispatchArray[entry.id]) return;

    setStateDispatchArray({
      ...stateDispatchArray,
      [entry.id]: { expand: setSectionOpen, select: setIsSelected, setSiblingIsSelected, depth },
    });
  }, [entry.id, setStateDispatchArray, stateDispatchArray, depth, renderChildren, setSiblingIsSelected]);

  useEffect(() => {
    if (!renderChildren) return;
    if (!entry) return;

    api.start({
      to: {
        height: sectionOpen ? `${(listHeight - depth) * 1.5}em` : "0",
      },
      config: {
        ...springsConfig,
        clamp: !sectionOpen,
      },
    });
  }, [entry, api, sectionOpen, renderChildren, listHeight, depth]);

  if (!renderChildren) return; // Restrict rendering to avoid max render

  const handleExpand = () => {
    // console.log("LayerState: ", stateDispatchArray);

    setHasBeenSelected(true);

    if (sectionOpen) {
      // Layer closing:
      setListHeight(parentsListHeight);
      stateDispatchArray[parentId].select(true);
      stateDispatchArray[entry.id].select(false);
      stateDispatchArray[entry.id].expand(false);
      Object.keys(stateDispatchArray).forEach((id) => {
        if (stateDispatchArray[id].depth >= depth) stateDispatchArray[id].setSiblingIsSelected(false);
      });
    } else {
      // Layer opening:
      setListHeight(entry.children.length + depth);
      stateDispatchArray[entry.id].expand(true);
      stateDispatchArray[entry.id].select(true);
      setSiblingIsSelected(true);

      // Deselect and close other layers:
      Object.keys(stateDispatchArray).forEach((id) => {
        if (stateDispatchArray[id].depth >= depth + 1) stateDispatchArray[id].setSiblingIsSelected(false);
        if (id !== entry.id) {
          stateDispatchArray[id].select(false);
          if (stateDispatchArray[id].depth >= depth) stateDispatchArray[id].expand(false);
        }
      });
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
                entry={nextEntry}
                onSelect={onSelect}
                stateDispatchArray={stateDispatchArray}
                setStateDispatchArray={setStateDispatchArray}
                parentId={entry.id}
                parentIsOpen={sectionOpen}
                siblingIsSelected={selectionMade}
                setSiblingIsSelected={setSelectionMade}
                renderChildren={hasBeenSelected}
                listHeight={listHeight}
                setListHeight={setListHeight}
                parentsListHeight={entry.children.length + depth}
                depth={depth + 1}
              />
            ))}
          </animated.div>
        </div>
      )}
    </>
  );
};

const Accordion = ({ directories, onSelect }) => {
  const [stateDispatchArray, setStateDispatchArray] = useState([]);
  const [selectionMade, setSelectionMade] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  // console.log("DIRECTORIES: ", directories);

  return (
    <div className={styles.root}>
      {directories.map((entry) => (
        <ExpandingLayer
          key={entry.id}
          entry={entry}
          onSelect={onSelect}
          stateDispatchArray={stateDispatchArray}
          setStateDispatchArray={setStateDispatchArray}
          parentId={entry.id}
          parentIsOpen
          siblingIsSelected={selectionMade}
          setSiblingIsSelected={setSelectionMade}
          renderChildren={true}
          listHeight={listHeight}
          setListHeight={setListHeight}
          parentsListHeight={entry.children.length}
          depth={0}
          root
        />
      ))}
    </div>
  );
};

export default Accordion;
