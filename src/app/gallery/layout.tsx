import type { Metadata } from "next";

import { getAlbums } from "@/lib/actions";

import MenuSystem from "@/ui/gallery/MenuSystem/MenuSystem";

import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Gallery",
};

const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const albums = await getAlbums();

  return (
    <div className={styles.root}>
      <MenuSystem albums={albums} />
      <div className={`${styles.contentContainer}`}>
        <div className={`${styles.pageBorder}`}>
          <div className={`${styles.pageContainer} ${styles.open}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
