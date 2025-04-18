"use client";

import React, { useState, useRef } from "react";

import Sidebar from "@/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/ui/gallery/TopBar/TopBar";

import styles from "./MenuSystem.module.scss";

const MenuSystem = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sideBarButtonClickAwayRef = useRef(null);

  return (
    <div className={styles.root}>
      <div className={styles.topBarContainer}>
        <TopBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sideBarButtonClickAwayRef={sideBarButtonClickAwayRef}
        />
      </div>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        riseAboveClickAwayRefs={[sideBarButtonClickAwayRef]}
      />
    </div>
  );
};

export default MenuSystem;
