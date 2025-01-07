"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/app/lib/helpers";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const ExpandingLayer = ({ entry, onSelect, layerState, setLayerState, renderChildren, depth }) => {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [hasBeenSelected, setHasBeenSelected] = useState(false);
  const [nextChildLength, setNextChildLength] = useState(1);
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  useLayoutEffect(() => {
    if (layerState[entry.id]) return;
    setLayerState({
      ...layerState,
      [entry.id]: { expander: setSectionOpen, selector: setIsSelected, depth },
    });
  }, [entry.id, setLayerState, layerState, depth]);

  useLayoutEffect(() => {
    if (!entry?.children?.length) return;

    setNextChildLength(entry.children.length);
  }, [entry]);

  useEffect(() => {
    if (!entry) return;

    api.start({
      to: {
        height: sectionOpen ? `${nextChildLength * 1.5}rem` : "0",
      },
      config: {
        ...springsConfig,
        clamp: !sectionOpen,
      },
    });
  }, [entry, api, sectionOpen, nextChildLength]);

  const handleExpand = () => {
    setHasBeenSelected(true);
    layerState[entry.id].expander(!sectionOpen);
    layerState[entry.id].selector(!sectionOpen); // only select if layer is opening
    Object.keys(layerState).forEach((item) => {
      if (item !== entry.id) {
        layerState[item].selector(false);
        if (layerState[item].depth >= depth) layerState[item].expander(false);
      }
    });
  };

  if (!renderChildren) return; // Restrict rendering to avoid max render

  return (
    <>
      {!entry.children.length ? (
        <Link onClick={onSelect} href={`/gallery/${entry.name}`}>
          {capitalise(entry.name)}
        </Link>
      ) : (
        <div className={`${styles.expandingLayerContainer}`}>
          <div className={`${styles.sectionName}${sectionOpen ? ` ${styles.isOpenLabel}` : ""}`} onClick={handleExpand}>
            {capitalise(entry.name)}
          </div>
          <animated.div
            className={`${styles.collapsingBox}${sectionOpen && !isSelected ? ` ${styles.fitContent}` : ""}${
              sectionOpen && isSelected ? ` ${styles.isOpenList}` : ""
            }`}
            style={{ ...springs }}
          >
            {entry.children.map((nextEntry) => (
              <ExpandingLayer
                key={nextEntry.id}
                entry={nextEntry} // next folder
                onSelect={onSelect} // callback used to close the sidebar on select
                layerState={layerState} // array to track stateDispatch for each closure
                setLayerState={setLayerState}
                renderChildren={hasBeenSelected} // used to restrict rendering
                depth={depth + 1} // used to decide which layers to close
              />
            ))}
          </animated.div>
        </div>
      )}
    </>
  );
};

const Accordion = ({ directories, onSelect }) => {
  const [layerState, setLayerState] = useState([]);

  return (
    <div className={styles.root}>
      {directories.map((entry) => (
        <ExpandingLayer
          key={entry.id}
          entry={entry}
          onSelect={onSelect}
          layerState={layerState}
          setLayerState={setLayerState}
          renderChildren={true}
          depth={0}
        />
      ))}
    </div>
  );
};

export default Accordion;
