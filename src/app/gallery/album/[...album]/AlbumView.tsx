"use client";

import useElementSize from "@/hooks/useElementSize";
import ImageSequencer from "@/ui/Album/ImageSequencer/ImageSequencer";
import AlbumSkeleton from "@/ui/skeletons/AlbumSkeleton/AlbumSkeleton";

import type { ImageDetails } from "@/definitions/definitions";

import styles from "./page.module.scss";

const AlbumView = ({ albumPath, images }: { albumPath: string; images: ImageDetails[] }) => {
  const { ref: contentRef, clientWidth: containerWidth } = useElementSize();
  const albumName = albumPath.split("/").filter(Boolean).at(-1) ?? albumPath;
  const ready = containerWidth > 0;

  return (
    <div className={styles.imagesContainer}>
      <div className={`${styles.skeleton}${ready ? ` ${styles.isHidden}` : ""}`} aria-hidden={ready}>
        <AlbumSkeleton />
      </div>
      <div className={styles.content} ref={contentRef}>
        <div className={styles.titleContainer}>
          <h1>{albumName}</h1>
          <p>{albumPath}</p>
        </div>
        {ready &&
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