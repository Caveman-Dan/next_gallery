"use client";

import React, { useRef, useEffect, useState } from "react";
import base64url from "base64url";
import Image, { ImageWithFallbackProps } from "@/ui/components/Image/Image";

import styles from "./ImageThumb.module.scss";
import Link from "next/link";

interface ImageThumbProps extends ImageWithFallbackProps {
  albumPath: string;
  fileName: string;
  srcWidth: number;
  srcHeight: number;
  thumbWidth: number;
  thumbHeight: number;
}

const ImageThumb = ({
  src,
  srcWidth,
  srcHeight,
  thumbWidth = 450,
  thumbHeight = 225,
  alt,
  albumPath,
  fileName,
  blurDataURL,
  ...props
}: ImageThumbProps) => {
  // const thumbRef = useRef<HTMLAnchorElement>(null);
  // const { clientWidth: containerWidth = 2000 } = useElementSize(thumbRef.current?.parentElement);

  // const singleSpace = containerWidth / 7;
  // const thumbWidth = srcWidth > srcHeight ? singleSpace * 2 : singleSpace;
  // const thumbHeight = (srcHeight / srcWidth) * thumbWidth;

  // useEffect(() => {
  //   console.log("DIMENTIONS: ", { singleSpace, thumbWidth, rowHeight });
  // });

  return (
    <Link
      // ref={thumbRef}
      href={`/gallery/image/${albumPath}/${fileName}?width=${srcWidth}&height=${srcHeight}&blurDataUrl=${base64url.fromBase64(
        blurDataURL as string
      )}`}
      className={styles.thumbContainer}
      style={{ minHeight: thumbHeight }}
    >
      {/* <div>{containerWidth}</div> */}
      <Image
        src={src}
        width={thumbWidth}
        height={thumbHeight}
        alt={`image for file - ${alt}`}
        blurDataURL={blurDataURL}
        {...props}
      />
    </Link>
  );
};

export default ImageThumb;
