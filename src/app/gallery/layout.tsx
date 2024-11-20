import React from "react";

import SideBar from "@/app/ui/gallery/SideBar/SideBar";
import TopBar from "@/app/ui/gallery/TopBar/TopBar";

import styles from "./layout.module.scss";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.root}>
    <div className={styles.topBarContainer}>
      <TopBar />
    </div>
    <div className={styles.contentContainer}>
      <div className={styles.sideBarContainer}>
        <SideBar />
      </div>
      <div className={styles.pageContainer}>{children}</div>
    </div>
  </div>
);

export default Layout;
