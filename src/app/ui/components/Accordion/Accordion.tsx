"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import { capitalise } from "@/app/lib/helpers";

import styles from "./Accordion.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const Accordion = ({ directories, onSelect }) => {
  const [sectionOpen, setSectionOpen] = useState(false);
  // const [nextChildLength, setNextChildLength] = useState(0);
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0" },
  });

  useEffect(() => {
    // if (!nextChildLength) return;

    api.start({
      to: {
        height: "4rem",
      },
      config: {
        ...springsConfig,
        clamp: !sectionOpen,
      },
    });
  }, [api, sectionOpen]);

  return (
    <>
      {directories.map((entry) => {
        if (!entry.children.length) {
          return (
            <Link onClick={onSelect} href={`/gallery/${entry.name}`} key={`/gallery/${entry.name}`}>
              {capitalise(entry.name)}
            </Link>
          );
        } else {
          // setNextChildLength(entry.children.length);
          return (
            <div className={styles.root} key={`/gallery/${entry.name}`}>
              <div className={styles.sectionName} onClick={() => setSectionOpen(!sectionOpen)}>
                {capitalise(entry.name)}
              </div>
              <animated.div className={styles.collapsingBox} style={{ ...springs }}>
                <Accordion directories={entry.children} onSelect={onSelect} />
              </animated.div>
            </div>
          );
        }
      })}
    </>
  );
};

export default Accordion;
