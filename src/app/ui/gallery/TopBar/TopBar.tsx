"use client";

import React from "react";
import Link from "@/ui/components/MountAnimation/AnimatedLink";

import { logout } from "@/lib/serverActions";
import { usePrincipal } from "@/ui/auth/PrincipalProvider";
import Burger from "@/ui/components/burgers/Burger2";
import ThemeSelector from "@/ui/gallery/TopBar/ThemeSelector";
import Logo from "./Logo";
import Button from "@/ui/components/Button/Button";

import styles from "./TopBar.module.scss";

import type { ModalSetActive } from "@/definitions/definitions";

const TopBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sideBarButtonClickAwayRef,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: ModalSetActive;
  sideBarButtonClickAwayRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const principal = usePrincipal();

  return (
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
          {principal.kind === "guest" ? (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          ) : (
            <form className={styles.logOutForm} action={logout}>
              {/* Client component can't call server functions do it with a form submit */}
              <Button type="submit">Logout</Button>{" "}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
