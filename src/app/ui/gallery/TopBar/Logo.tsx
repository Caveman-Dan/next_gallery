"use client";
import { usePathname, useSearchParams } from "next/navigation";

import Link from "@/ui/components/MountAnimation/AnimatedLink";

import LogoIcon from "@/assets/logoNoName.svg"; // This '?url' syntax works with SVGR
import LogoWithName from "@/assets/logoWithName.svg"; // This '?url' syntax works with SVGR
import LogoWithSideName from "@/assets/logoSideName.svg"; // This '?url' syntax works with SVGR

import styles from "./logo.module.scss";

const Logo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onGalleryIndex = pathname === "/gallery" || pathname === "/gallery/";

  console.log("HERE: ", { searchParams, pathname, onGalleryIndex });

  const href = onGalleryIndex ? "/" : "/gallery";
  // const href = "/gallery";
  const returnTo = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  return (
    <div className={styles.root}>
      <Link
        href={href}
        returnTo={onGalleryIndex ? returnTo : undefined}
        returnIndex={onGalleryIndex ? "home" : undefined}
        aria-label={onGalleryIndex ? "Home" : "Gallery"}
        className={styles.link}
      >
        <LogoIcon className={`${styles.logoIcon} ${styles.imageSm}`} height="100%" />
        <LogoWithName className={`${styles.logoIcon} ${styles.imageMd}`} height="100%" />
        <LogoWithSideName className={`${styles.logoIcon} ${styles.imageLg}`} height="100%" />
      </Link>
    </div>
  );
};

export default Logo;
