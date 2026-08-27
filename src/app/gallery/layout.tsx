import MenuSystem from "@/ui/gallery/MenuSystem/MenuSystem";
import MountAnimation from "@/ui/components/MountAnimation/MountAnimation";

import { mainPageFade } from "@/ui/components/MountAnimation/MountAnimationConfig";
import styles from "./layout.module.scss";
import { Suspense } from "react";

import { getAlbums } from "@/lib/actions";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const albums = await getAlbums();

  return (
    <div className={styles.root}>
      <MountAnimation mountAnimationConf={mainPageFade}>
        <Suspense>
          <MenuSystem albums={albums} />
        </Suspense>
        <div className={`${styles.contentContainer}`}>
          <div className={`${styles.pageBorder}`}>
            <div className={styles.pageContainer}>{children}</div>
          </div>
        </div>
      </MountAnimation>
    </div>
  );
};

export default Layout;
