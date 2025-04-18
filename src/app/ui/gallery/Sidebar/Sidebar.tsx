"use client";

import React, { useEffect, useRef } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import Accordion from "@/ui/components/Accordion/Accordion";
import ClickAway from "@/ui/components/ClickAway/ClickAway";
import UserProfileLink from "@/ui/gallery/Sidebar/UserProfileLink";
import SettingsLink from "./SettingsLink";

import styles from "./Sidebar.module.scss";
import { sideBar as springsConfig } from "@/style/springsConfig";

import useWindowSize from "@/hooks/useWindowSize";

import { InteractiveToggleProps } from "@/definitions/definitions";

type SidebarProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  isSidebarOpen: InteractiveToggleProps["state"];
  setIsSidebarOpen: InteractiveToggleProps["setState"];
  riseAboveClickAwayRefs: React.RefObject<HTMLDivElement>[];
};

const SideBar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, riseAboveClickAwayRefs }) => {
  const windowSize = useWindowSize();
  const thisNode = useRef(null);
  const dropdownApi = useSpringRef();
  const sideApi = useSpringRef();

  const dropdownSprings = useSpring({
    ref: dropdownApi,
    from: {
      height: "0",
    },
  });

  const sideSprings = useSpring({
    ref: sideApi,
    from: {
      width: "0",
    },
  });

  useEffect(() => {
    dropdownApi.start({
      to: {
        height: isSidebarOpen ? "80vh" : "0",
      },
      config: {
        ...springsConfig,
        clamp: !isSidebarOpen,
      },
    });

    sideApi.start({
      to: {
        width: isSidebarOpen ? "400px" : "0",
      },
      config: {
        ...springsConfig,
        clamp: !isSidebarOpen,
      },
    });
  }, [dropdownApi, sideApi, isSidebarOpen]);

  return (
    <>
      <ClickAway
        active={isSidebarOpen}
        setActive={setIsSidebarOpen}
        blur
        parentRefs={[...riseAboveClickAwayRefs, thisNode]}
      />
      <animated.div
        className={`${styles.root} ${isSidebarOpen ? "" : styles.isTransparent}`}
        style={windowSize.aboveMd ? { ...sideSprings } : { ...dropdownSprings }}
        ref={thisNode}
      >
        <div className={styles.content}>
          <div className={styles.userProfileContainer}>
            <UserProfileLink />
          </div>
          <hr />
          <div className={styles.galleriesMenu}>
            <Accordion onSelect={() => setTimeout(() => setIsSidebarOpen(false), 200)} isSidebarOpen={isSidebarOpen} />
          </div>
          <hr />
          <div className={styles.settingsLink}>
            <SettingsLink />
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default SideBar;
