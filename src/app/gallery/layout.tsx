import type { Metadata } from "next";

import MenuSystem from "@/ui/gallery/MenuSystem/MenuSystem";

import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Gallery",
};

const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => (
  <div className={styles.root}>
    <MenuSystem />
    <div className={`${styles.contentContainer}`}>
      <div className={`${styles.pageBorder}`}>
        <div className={styles.pageContainer}>{children}</div>
      </div>
    </div>
  </div>
);

export default Layout;
