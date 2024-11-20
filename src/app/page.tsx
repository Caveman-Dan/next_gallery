import Image from "next/image";
import Link from "next/link";

import LogoWithSideName from "@/assets/logoSideNameBig_light.svg";
import Button from "@/ui/components/Button/Button.tsx";

import styles from "./page.module.scss";

const Home = () => {
  return (
    <main className={styles.root}>
      <div className={styles.heroContainer}>
        <div className={styles.logoContainer}>
          <Image className={styles.logo} src={LogoWithSideName} alt="Next Gallery Logo" fill />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.sidePanel}>
          <h1>Next Gallery</h1>
          <Link className={styles.exploreButton} href="/gallery">
            <Button>Explore</Button>
          </Link>
        </div>
        <div className={styles.content}>
          <h1>Content here</h1>
        </div>
      </div>
    </main>
  );
};

export default Home;
