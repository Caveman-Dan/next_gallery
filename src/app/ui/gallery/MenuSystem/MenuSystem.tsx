"use client";

import React, { useRef } from "react";

import Sidebar from "@/ui/gallery/Sidebar/Sidebar";
import TopBar from "@/ui/gallery/TopBar/TopBar";

import ClickAway, { useOpenModal } from "@/ui/components/ClickAway/ClickAway";

import styles from "./MenuSystem.module.scss";

import type { DirectoryTree } from "directory-tree";

const ANIMATION_DELAY = 400;

const MenuSystem = ({ albums }: { albums: DirectoryTree }) => {
  const sideBarButtonClickAwayRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, isSidebarClosing, setIsSidebarOpen] = useOpenModal({
    delay: ANIMATION_DELAY,
    parentRefs: [sideBarButtonClickAwayRef],
  });

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
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} albums={albums} />
    </div>
  );
};

export default MenuSystem;
