"use client";

import React from "react";

import Burger from "@/app/ui/components/burgers/Burger2";
import ThemeSelector from "@/app/ui/gallery/TopBar/ThemeSelector";
import Logo from "./Logo";
import Button from "../../components/Button/Button";

import styles from "./TopBar.module.scss";

const TopBar = ({
  sidebarOpen,
  setSidebarOpen,
  sideBarButtonClickAwayRef,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarButtonClickAwayRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className={styles.root}>
    <div className={styles.leftSide}>
      <div className={styles.burgerContainer} ref={sideBarButtonClickAwayRef}>
        <Burger state={sidebarOpen} setState={setSidebarOpen} />
      </div>
      <Logo />
    </div>
    <div className={styles.rightSide}>
      <div className={styles.themeSelectWrapper}>
        <ThemeSelector />
      </div>
      <div className={styles.loginButtonContainer}>
        <Button>Login</Button>
      </div>
    </div>
  </div>
);

export default TopBar;
