import type { Metadata } from "next";

import MenuSystem from "@/app/ui/gallery/MenuSystem/MenuSystem";

import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Gallery",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.root}>
      <MenuSystem />
      <div className={`${styles.contentContainer}`}>
        <div className={`${styles.pageContainer} ${styles.open}`}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
