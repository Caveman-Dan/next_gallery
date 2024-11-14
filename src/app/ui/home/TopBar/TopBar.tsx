"use client";

import React from "react";

import Burger from "@/app/ui/Burgers/Burger4";
import Logo from "./Logo";

import styles from "./TopBar.module.scss";

const TopBar = () => (
  <div className={styles.root}>
    <div className={styles.leftSide}>
      <div className={styles.burgerContainer}>
        <Burger />
      </div>
      <Logo />
    </div>
    <div className={styles.rightSide}>
      <div className={styles.loginButtonContainer}>
        <button>Login</button>
      </div>
    </div>
  </div>
);

export default TopBar;
