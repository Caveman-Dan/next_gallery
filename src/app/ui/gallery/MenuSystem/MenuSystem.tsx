"use client";

import React, { useState } from "react";

import SideBar from "@/app/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/app/ui/gallery/TopBar/TopBar";

import styles from "./MenuSystem.module.scss";

const MenuSystem = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.topBarContainer}>
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>
  );
};

export default MenuSystem;
