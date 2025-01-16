import type { Metadata } from "next";

import HomeTopBar from "@/ui/Home/HomeTopBar/HomeTopBar";

import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Welcome",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={styles.root}>
      <HomeTopBar />
      {children}
    </div>
  );
};

export default RootLayout;
