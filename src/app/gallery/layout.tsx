import MenuSystem from "@/ui/gallery/MenuSystem/MenuSystem";
import MountAnimation from "@/ui/components/MountAnimation/MountAnimation";

import { mainPageFade } from "@/ui/components/MountAnimation/MountAnimationConfig";
import styles from "./layout.module.scss";
import { Suspense } from "react";

import { getAlbums } from "@/lib/actions";
import { isApiErrorResponse } from "@/lib/helpers";

import type { Metadata } from "next";
import AnimatedComponent, { AnimatedComponentProvider } from "@/ui/components/AnimatedComponent/AnimatedComponent";

export const metadata: Metadata = {
  title: "Gallery",
};

const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const albumsResult = await getAlbums();
  const albums = isApiErrorResponse(albumsResult) ? undefined : albumsResult;

  return (
    <AnimatedComponentProvider fadeMs={800}>
      <MountAnimation mountAnimationConf={mainPageFade}>
        <Suspense>
          <MenuSystem albums={albums} />
        </Suspense>
        <div className={`${styles.contentContainer}`}>
          <AnimatedComponent>
            <div className={`${styles.pageBorder}`}>
              <div className={styles.pageContainer}>{children}</div>
            </div>
          </AnimatedComponent>
        </div>
      </MountAnimation>
    </AnimatedComponentProvider>
  );
};

export default Layout;
