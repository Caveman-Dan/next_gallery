"use client";

import base64url from "base64url";
import Image, { ImageWithFallbackProps } from "@/ui/components/Image/Image";

import styles from "./ImageThumb.module.scss";
import Link from "next/link";

// Stable optimizer width. Display size stays on the row wrapper via CSS.
const THUMB_SOURCE_WIDTH = 600;

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
  const sourceHeight = Math.max(1, Math.round((srcHeight / srcWidth) * THUMB_SOURCE_WIDTH));

  return (
    <Link
      href={`/gallery/image/${albumPath}/${fileName}?width=${srcWidth}&height=${srcHeight}&blurDataUrl=${base64url.fromBase64(
        blurDataURL as string
      )}`}
      className={styles.thumbContainer}
    >
      <Image
        src={src}
        width={THUMB_SOURCE_WIDTH}
        height={sourceHeight}
        sizes={`${Math.ceil(thumbWidth)}px`}
        alt={`image for file - ${alt}`}
        blurDataURL={blurDataURL}
        {...props}
      />
    </Link>
  );
};

export default ImageThumb;
