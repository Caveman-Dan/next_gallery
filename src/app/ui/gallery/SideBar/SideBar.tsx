import React, { useEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import ClickAway from "@/ui/components/ClickAway/ClickAway";

import styles from "./SideBar.module.scss";

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
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
        mass: 2,
        tension: 400,
        friction: 20,
        precision: 0.0,
        clamp: !sidebarOpen,
      },
    });
  }, [api, sidebarOpen]);

  return (
    <animated.div className={`${styles.root}`} style={{ ...springs }}>
      <ClickAway active={sidebarOpen} setActive={setSidebarOpen} />
      <h1>hello</h1>
      <h1>hello</h1>
      <h1>hello</h1>
      <h1>hello</h1>
      <h1>hello</h1>
      <h1>hello</h1>
    </animated.div>
  );
};

export default SideBar;
