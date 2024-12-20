"use client";

import React, { useState, useRef } from "react";

import Sidebar from "@/app/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/app/ui/gallery/TopBar/TopBar";

import styles from "./MenuSystem.module.scss";

const MenuSystem = ({ albums }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sideBarButtonClickAwayRef = useRef(null);

  return (
    <div className={styles.root}>
      <div className={styles.topBarContainer}>
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sideBarButtonClickAwayRef={sideBarButtonClickAwayRef}
        />
      </div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        riseAboveClickAwayRefs={[sideBarButtonClickAwayRef]}
        albums={albums}
      />
    </div>
  );
};

export default MenuSystem;
