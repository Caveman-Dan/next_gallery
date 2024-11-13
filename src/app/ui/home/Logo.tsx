"use client";

import Link from "next/link";
import Image from "next/image";

import useWindowSize from "@/hooks/useWindowSize";
import LogoWithName from "@/assets/logoWithName.svg";
import LogoIcon from "@/assets/logo.svg";

import styles from "./logo.module.scss";
import breakpoints from "@/style/breakpoints.json";

const dispenseLogo = (width) =>
  width >= breakpoints.md ? LogoWithName : LogoIcon;

const Logo = () => {
  const windowSize = useWindowSize();

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.link}>
        <Image
          className={styles.image}
          src={dispenseLogo(windowSize.width)}
          alt="Next Gallery Logo"
          fill
          // width="48"
          // height="48"
        />
      </Link>
    </div>
  );
};

export default Logo;
