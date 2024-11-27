"use client";

import Link from "next/link";

import LogoIcon from "@/assets/logoNoName.svg"; // This '?url' syntax works with SVGR
import LogoWithName from "@/assets/logoWithName.svg"; // This '?url' syntax works with SVGR
import LogoWithSideName from "@/assets/logoSideName.svg"; // This '?url' syntax works with SVGR

import styles from "./logo.module.scss";

const Logo = () => (
  <div className={styles.root}>
    <Link href="/" className={styles.link}>
      <LogoIcon className={`${styles.logoIcon} ${styles.imageSm}`} hight="100%" alt="Next Gallery Logo" />
      <LogoWithName className={`${styles.logoIcon} ${styles.imageMd}`} hight="100%" alt="Next Gallery Logo" />
      <LogoWithSideName className={`${styles.logoIcon} ${styles.imageLg}`} height="100%" alt="Next Gallery Logo" />
    </Link>
  </div>
);

export default Logo;
