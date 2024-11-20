"use client";

import Link from "next/link";
import Image from "next/image";

import LogoIcon from "@/assets/logo_light.svg";
import LogoWithName from "@/assets/logoWithName_light.svg";
import LogoWithSideName from "@/assets/logoSideNameBig_light.svg";

import styles from "./logo.module.scss";

const Logo = () => (
  <div className={styles.root}>
    <Link href="/" className={styles.link}>
      <Image
        className={styles.imageSm}
        src={LogoIcon}
        alt="Next Gallery Logo"
        fill
        // width="48"
        // height="48"
      />
      <Image
        className={styles.imageMd}
        src={LogoWithName}
        alt="Next Gallery Logo"
        fill
        // width="48"
        // height="48"
      />
      <Image
        className={styles.imageLg}
        src={LogoWithSideName}
        alt="Next Gallery Logo"
        fill
        // width="48"
        // height="48"
      />
    </Link>
  </div>
);

export default Logo;
