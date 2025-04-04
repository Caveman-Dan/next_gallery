import React, { useRef, useState, useEffect } from "react";

import ImageThumb from "../ImageThumb/ImageThumb";

import type { ImageDetails } from "@/definitions/definitions";

import styles from "./ImageRow.module.scss";

const SHOW_INFO = false;

type ImageRowProps = {
  row: {
    images: ImageDetails[];
    rowHeight: number;
    spacing: number;
  };
  albumPath: string;
};

const ImageRow = ({ row: { images, rowHeight, spacing }, albumPath }: ImageRowProps) => {
  return (
    <div className={styles.root} style={{ height: rowHeight, marginBottom: spacing }}>
      {(images as ImageDetails[])?.map((image: ImageDetails) => {
        const { width, height } = image.details;
        const imageWidth = (width / height) * rowHeight;

        const imageUrl = new URL(
          `${process.env.NEXT_PUBLIC_API_GET_IMAGE}/${albumPath}/${image.fileName}`,
          process.env.NEXT_PUBLIC_API
        );

        return (
          <div className={styles.thumbContainer} key={image.md5 as string} style={{ width: imageWidth }}>
            <div className={styles.skeleton} />
            {SHOW_INFO && (
              <div className={`${styles.floatingInfo}`}>
                <p>src ratio: {width / height}</p>
                <p>adj ratio: {imageWidth / rowHeight}</p>
                <p>
                  src dimensions w {width} - h: {height}
                </p>
                <p>
                  adj dimensions w {imageWidth} - h: {rowHeight}
                </p>
                <p>Row height: {rowHeight}</p>
                <p></p>
              </div>
            )}
            <ImageThumb
              src={imageUrl.href}
              srcWidth={image.details.width}
              srcHeight={image.details.height}
              thumbWidth={imageWidth}
              thumbHeight={rowHeight}
              alt={`image of ${image.fileName}`}
              placeholder="blur"
              blurDataURL={image.placeholder.blurData}
              albumPath={albumPath}
              fileName={image.fileName}
            />
          </div>
        );
      })}{" "}
    </div>
  );
};

export default ImageRow;
