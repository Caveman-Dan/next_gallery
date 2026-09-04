"use client";

// import base64url from "base64url";
import Image, { ImageWithFallbackProps } from "@/ui/components/Image/Image";

import styles from "./ImageThumb.module.scss";
import Link from "next/link";
import { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";

// Stable optimizer width. Display size stays on the row wrapper via CSS.
const THUMB_SOURCE_WIDTH = 600;

interface ImageThumbProps extends ImageWithFallbackProps {
  albumPath: string;
  fileName: string;
  srcWidth: number;
  srcHeight: number;
  thumbWidth: number;
}

const ImageThumb = ({
  src,
  srcWidth,
  srcHeight,
  thumbWidth = 450,
  alt,
  albumPath,
  fileName,
  blurDataURL,
  ...props
}: ImageThumbProps) => {
  const sourceHeight = Math.max(1, Math.round((srcHeight / srcWidth) * THUMB_SOURCE_WIDTH));
  const { push } = useAnimatedComponent();
  const href = `/gallery/image/${albumPath}/${fileName}`;

  return (
    <Link
      href={href}
      className={styles.thumbContainer}
      onClick={(event) => {
        event.preventDefault();
        push(href);
      }}
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
