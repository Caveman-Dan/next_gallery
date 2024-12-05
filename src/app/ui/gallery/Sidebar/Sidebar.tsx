import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import ClickAway from "@/ui/components/ClickAway/ClickAway";

import styles from "./Sidebar.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

import { InteractiveToggleProps } from "@/app/lib/definitions";

type SidebarProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  sidebarOpen: InteractiveToggleProps["state"];
  setSidebarOpen: InteractiveToggleProps["setState"];
  riseAboveClickAwayRefs: React.RefObject<HTMLDivElement>[];
};

const SideBar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, riseAboveClickAwayRefs }) => {
  const thisNode = useRef(null);
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { width: "0" },
  });

  useEffect(() => {
    api.start({
      to: {
        width: sidebarOpen ? "20%" : "0",
      },
      config: {
        ...springsConfig,
        clamp: !sidebarOpen,
      },
    });
  }, [api, sidebarOpen]);

  return (
    <>
      <ClickAway
        active={sidebarOpen}
        setActive={setSidebarOpen}
        blur
        parentRefs={[...riseAboveClickAwayRefs, thisNode]}
      />
      <animated.div className={`${styles.root}`} style={{ ...springs }} ref={thisNode}>
        <div className={styles.content}>
          <div className={styles.userProfileContainer}>
            <h2>User Profile</h2>
          </div>
          <hr />
          <div className={styles.galleriesMenu}>
            <Link href={`Gallery/${"Gallery1"}/`}>Gallery1</Link>
            <Link href={`Gallery/${"Gallery2"}/`}>Gallery2</Link>
            <Link href={`Gallery/${"Gallery3"}/`}>Gallery3</Link>
            <Link href={`Gallery/${"Gallery4"}/`}>Gallery4</Link>
          </div>
          <hr />
          <div className={styles.settings}>
            <h2>Settings</h2>
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default SideBar;
