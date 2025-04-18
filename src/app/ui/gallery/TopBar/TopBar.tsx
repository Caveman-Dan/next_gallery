"use client";

import React from "react";
import Link from "next/link";

import Burger from "@/ui/components/burgers/Burger2";
import ThemeSelector from "@/ui/gallery/TopBar/ThemeSelector";
import Logo from "./Logo";
import Button from "@/ui/components/Button/Button";

import styles from "./TopBar.module.scss";

const TopBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sideBarButtonClickAwayRef,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarButtonClickAwayRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className={styles.root}>
    <div className={styles.leftSide}>
      <div className={styles.burgerContainer} ref={sideBarButtonClickAwayRef}>
        <Burger state={isSidebarOpen} setState={setIsSidebarOpen} />
      </div>
      <Logo />
    </div>
    <div className={styles.rightSide}>
      <div className={styles.themeSelectWrapper}>
        <ThemeSelector />
      </div>
      <div className={styles.loginButtonContainer}>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default TopBar;
