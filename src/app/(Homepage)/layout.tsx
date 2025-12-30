import type { Metadata } from "next";

import HomeTopBar from "@/ui/Home/HomeTopBar/HomeTopBar";
import MountAnimation from "@/ui/components/MountAnimation/MountAnimation";

import styles from "./layout.module.scss";
import { mainPageFade } from "@/ui/components/MountAnimation/MountAnimationConfig";

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
      <MountAnimation mountAnimationConf={mainPageFade}>
        <HomeTopBar />
        {children}
      </MountAnimation>
    </div>
  );
};

export default RootLayout;
