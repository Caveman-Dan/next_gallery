"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Sidebar from "@/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/ui/gallery/TopBar/TopBar";

import ClickAway, { useOpenModal } from "@/ui/components/ClickAway/ClickAway";

import styles from "./MenuSystem.module.scss";

const ANIMATION_DELAY = 400;

const MenuSystem = () => {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const sideBarButtonClickAwayRef = useRef(null);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOpen, isSidebarClosing, setIsSidebarOpen] = useOpenModal(
    "sidebar",
    [sideBarButtonClickAwayRef],
    ANIMATION_DELAY,
    false
  );

  // const isSidebarOpen = searchParams.has("sidebar-open");

  // const openSidebar = (newState: boolean) => {
  //   if (newState) router.push("?sidebar-open=true");
  //   else router.back();
  // };

  return (
    <div className={styles.root}>
      <div className={styles.topBarContainer}>
        <TopBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sideBarButtonClickAwayRef={sideBarButtonClickAwayRef}
        />
      </div>
      <ClickAway
        active={isSidebarOpen}
        setActive={setIsSidebarOpen}
        closing={isSidebarClosing}
        delay={ANIMATION_DELAY}
        blur
      />
      <Sidebar isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default MenuSystem;
