"use client";

import Link from "next/link";
import Image from "next/image";

import useWindowSize from "@/hooks/useWindowSize";
import LogoIcon from "@/assets/logoWithName.svg";

import styles from "./logo.module.scss";

const Logo = () => {
  const windowSize = useWindowSize();

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.link}>
        <Image
          className={styles.image}
          src={LogoIcon}
          alt="Next Gallery Logo"
          fill
          // width="48"
          // height="48"
        />
      </Link>
      <h1>{windowSize.width}</h1>
    </div>
  );
};

export default Logo;
