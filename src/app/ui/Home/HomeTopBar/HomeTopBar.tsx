"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import LogoWithSideName from "@/assets/logoSideName.svg?url";
import Button from "@/ui/components/Button/Button";
import useSticky from "@/hooks/useSticky";

import ImageIcon from "@/assets/imageIcon.svg";

import styles from "./HomeTopBar.module.scss";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";

const HomeTopBar = () => {
  const { isSticky, ref: stickRef } = useSticky();

  return (
    <>
      <div className={`${styles.heroContainer}  ${isSticky ? styles.stickyHero : ""}`}>
        <div className={styles.logoContainer}>
          <Image className={styles.logo} src={LogoWithSideName} alt="Next Gallery Logo" fill />
        </div>
      </div>
      <div className={`${styles.underBar} ${isSticky ? styles.underBarSticky : ""}`} ref={stickRef}>
        <Link className={`${styles.galleryButton} ${isSticky ? styles.stickyButton : ""}`} href="/gallery">
          <Button>
            <b>
              <p>Gallery</p>
            </b>
            <DirectionalArrow hide={isSticky} direction="right" colour="var(--text-colour-base)" />
            <ImageIcon className={styles.galleryButtonIcon} height="100%" />
          </Button>
        </Link>
      </div>
    </>
  );
};

export default HomeTopBar;
