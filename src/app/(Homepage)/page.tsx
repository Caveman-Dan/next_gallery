"use server";

import React from "react";

import Section1 from "@/ui/Home/HomeTopBar/Section1/Section1";

import type { NextPage } from "next";

import styles from "./page.module.scss";

const Home: NextPage = () => {
  return (
    <main className={`${styles.root}`}>
      <div className={`${styles.content}`}>
        <br />
        <Section1 />
        <br />
      </div>
    </main>
  );
};

export default Home;
