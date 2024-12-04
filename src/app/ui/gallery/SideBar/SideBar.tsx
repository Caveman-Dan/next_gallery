import React, { useEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import ClickAway from "@/ui/components/ClickAway/ClickAway";

import styles from "./SideBar.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

import { InteractiveToggleProps } from "@/app/lib/definitions";

type SidebarProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  sidebarOpen: InteractiveToggleProps["state"];
  setSidebarOpen: InteractiveToggleProps["setState"];
};

const SideBar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
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
      <ClickAway active={sidebarOpen} setActive={setSidebarOpen} />
      <animated.div className={`${styles.root}`} style={{ ...springs }}>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
      </animated.div>
    </>
  );
};

export default SideBar;
