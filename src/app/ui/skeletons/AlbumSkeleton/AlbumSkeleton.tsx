"use client";

import { useEffect, useState } from "react";
import styles from "./AlbumSkeleton.module.scss";
import Spinner from "@/ui/components/Spinner/Spinner";

const AlbumSkeleton = ({ delay = 0 }: { delay?: number }) => {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setShow(true);
      return;
    }
    setShow(false);
    const showTimer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(showTimer);
  }, [delay]);

  return (
    <div className={styles.root}>
      {show && <Spinner />}
      {/* <h1>Loading...</h1> */}
    </div>
  );
};

export default AlbumSkeleton;
