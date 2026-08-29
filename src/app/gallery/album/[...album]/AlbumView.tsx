"use client";

import { useEffect, useState } from "react";

import useElementSize from "@/hooks/useElementSize";
import ImageSequencer from "@/ui/Album/ImageSequencer/ImageSequencer";
import AlbumSkeleton from "@/ui/skeletons/AlbumSkeleton/AlbumSkeleton";

import type { ImageDetails } from "@/definitions/definitions";

import styles from "./page.module.scss";

const decodeDataUrl = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const AlbumView = ({ albumPath, images }: { albumPath: string; images: ImageDetails[] }) => {
  const { ref: contentRef, clientWidth: containerWidth } = useElementSize();
  const albumName = albumPath.split("/").filter(Boolean).at(-1) ?? albumPath;
  const measured = containerWidth > 0;
  const [blursReady, setBlursReady] = useState(images.length === 0);
  const ready = measured && blursReady;

  useEffect(() => {
    const urls = images
      .map((image) => image.placeholder?.blurData)
      .filter((src): src is string => Boolean(src));

    if (!urls.length) {
      setBlursReady(true);
      return;
    }

    let live = true;
    setBlursReady(false);
    Promise.all(urls.map(decodeDataUrl)).then(() => {
      if (live) setBlursReady(true);
    });

    return () => {
      live = false;
    };
  }, [images]);

  return (
    <div className={styles.imagesContainer}>
      <div className={`${styles.skeleton}${ready ? ` ${styles.isHidden}` : ""}`} aria-hidden={ready}>
        <AlbumSkeleton />
      </div>
      <div className={`${styles.content}${ready ? ` ${styles.isVisible}` : ""}`} ref={contentRef}>
        <div className={styles.titleContainer}>
          <h1>{albumName}</h1>
          <p>{albumPath}</p>
        </div>
        {measured &&
          (images.length ? (
            <ImageSequencer images={images} albumPath={albumPath} containerWidth={containerWidth} />
          ) : (
            <p>This album has no images.</p>
          ))}
      </div>
    </div>
  );
};

export default AlbumView;