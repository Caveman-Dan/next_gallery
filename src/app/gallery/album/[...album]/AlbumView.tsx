"use client";

import useElementSize from "@/hooks/useElementSize";
import ImageSequencer from "@/ui/Album/ImageSequencer/ImageSequencer";
import Spinner from "@/ui/components/Spinner/Spinner";

import type { ImageDetails } from "@/definitions/definitions";

import styles from "./page.module.scss";

const AlbumView = ({ albumPath, images }: { albumPath: string; images: ImageDetails[] }) => {
  const { ref: containerRef, clientWidth: containerWidth } = useElementSize();
  const albumName = albumPath.split("/").filter(Boolean).at(-1) ?? albumPath;

  return (
    <div className={styles.imagesContainer} ref={containerRef}>
      <div className={styles.titleContainer}>
        <h1>{albumName}</h1>
        <p>{albumPath}</p>
      </div>
      {!containerWidth ? (
        <Spinner />
      ) : images.length ? (
        <ImageSequencer images={images} albumPath={albumPath} containerWidth={containerWidth} />
      ) : (
        <p>This album has no images.</p>
      )}
    </div>
  );
};

export default AlbumView;