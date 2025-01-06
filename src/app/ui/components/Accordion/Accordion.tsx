"use client";

import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/app/lib/helpers";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const ExpandingLayer = ({ entry, onSelect, expanders, setExpanders, ancestors, setAncestors, depth }) => {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [nextChildLength, setNextChildLength] = useState(1);
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  useLayoutEffect(() => {
    if (expanders[entry.id]) return;
    setExpanders({ ...expanders, [entry.id]: { expander: setSectionOpen, selector: setIsSelected, depth } });
  }, [entry.id, setExpanders, expanders, depth]);

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
    expanders[entry.id].expander(!sectionOpen);
    expanders[entry.id].selector(!isSelected);
    Object.keys(expanders).forEach((item) => {
      if (item !== entry.id) {
        expanders[item].selector(false);
        if (expanders[item].depth >= depth) expanders[item].expander(false);
      }
    });
  };

  return (
    <>
      {!entry.children.length ? (
        <Link onClick={onSelect} href={`/gallery/${entry.name}`}>
          {capitalise(entry.name)}
        </Link>
      ) : (
        <div className={styles.expandingLayerContainer}>
          <div className={styles.sectionName} onClick={handleExpand}>
            {capitalise(entry.name)}
          </div>
          <animated.div
            className={`${styles.collapsingBox} ${sectionOpen && !isSelected ? styles.fitContent : ""}`}
            style={{ ...springs }}
          >
            {entry.children.map((nextEntry) => (
              <ExpandingLayer
                key={nextEntry.id}
                entry={nextEntry}
                onSelect={onSelect}
                expanders={expanders}
                setExpanders={setExpanders}
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
  const [expanders, setExpanders] = useState([]);

  return (
    <div className={styles.root}>
      {directories.map((entry) => (
        <ExpandingLayer
          key={entry.id}
          entry={entry}
          onSelect={onSelect}
          expanders={expanders}
          setExpanders={setExpanders}
          depth={0}
        />
      ))}
    </div>
  );
};

export default Accordion;
