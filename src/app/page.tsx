"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import LogoWithSideName from "@/assets/logoSideName.svg?url";
import Button from "@/ui/components/Button/Button";
import useSticky from "./hooks/useSticky";

import ImageIcon from "@/assets/imageIcon.svg";

import styles from "./page.module.scss";

const Home = () => {
  const { isSticky, ref: stickRef } = useSticky();

  return (
    <main className={`${styles.root}`}>
      <div className={`${styles.heroContainer}  ${isSticky ? styles.stickyHero : ""}`}>
        <div className={styles.logoContainer}>
          <Image className={styles.logo} src={LogoWithSideName} alt="Next Gallery Logo" fill />
        </div>
      </div>
      <div className={`${styles.contentContainer}`}>
        <div className={`${styles.underBar} ${isSticky ? styles.underBarSticky : ""}`} ref={stickRef}>
          <Link className={`${styles.galleryButton} ${isSticky ? styles.stickyButton : ""}`} href="/gallery">
            <Button>
              <p>Gallery -></p>
              <ImageIcon className={styles.galleryButtonIcon} height="100%" alt="gallery icon" />
            </Button>
          </Link>
        </div>
        <div className={`${styles.content}`}>
          <h1>Welcome to Dan's Gallery</h1>
          <br />
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
          <h1>Content here</h1>
        </div>
      </div>
    </main>
  );
};

export default Home;
