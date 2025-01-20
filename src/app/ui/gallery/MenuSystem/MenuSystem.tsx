"use client";

import React, { useState, useRef } from "react";

import Sidebar from "@/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/ui/gallery/TopBar/TopBar";

import styles from "./MenuSystem.module.scss";

import { DirectoryTree } from "directory-tree";

const MenuSystem = ({ albums }: { albums: DirectoryTree }) => {
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
