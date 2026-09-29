import React from "react";

import Section1 from "@/ui/Home/Section1/Section1";
import ProjectOverview from "@/ui/Home/ProjectOverview/ProjectOverview";

import type { NextPage } from "next";

import styles from "./page.module.scss";

const Home: NextPage = () => {
  return (
    <main className={styles.root}>
      <div className={styles.content}>
        <ProjectOverview />
      </div>
    </main>
  );
};

export default Home;
