"use client";

import React, { useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Sidebar from "@/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/ui/gallery/TopBar/TopBar";

import styles from "./MenuSystem.module.scss";

const MenuSystem = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sideBarButtonClickAwayRef = useRef(null);

  const openSidebar = (newState: boolean) => {
    if (newState) router.push("?sidebar-open=true");
    else router.back();
  };

  return (
    <div className={styles.root}>
      <div className={styles.topBarContainer}>
        <TopBar
          isSidebarOpen={searchParams.has("sidebar-open")}
          setIsSidebarOpen={openSidebar}
          sideBarButtonClickAwayRef={sideBarButtonClickAwayRef}
        />
      </div>
      <Suspense fallback={null}>
        <Sidebar
          isSidebarOpen={searchParams.has("sidebar-open")}
          setIsSidebarOpen={openSidebar}
          riseAboveClickAwayRefs={[sideBarButtonClickAwayRef]}
        />
      </Suspense>
    </div>
  );
};

export default MenuSystem;
