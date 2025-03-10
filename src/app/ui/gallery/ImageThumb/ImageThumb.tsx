import base64url from "base64url";
import Image, { ImageWithFallbackProps } from "@/ui/components/Image/Image";

import styles from "./ImageThumb.module.scss";
import Link from "next/link";

interface ImageThumbProps extends ImageWithFallbackProps {
  albumPath: string;
  fileName: string;
}

const ImageThumb = ({ src, width, height, alt, albumPath, fileName, blurDataURL, ...props }: ImageThumbProps) => {
  const MAX_WIDTH = 200;
  const newHeight = ((height as number) / (width as number)) * MAX_WIDTH;

  return (
    <Link
      href={`/gallery/image/${albumPath}/${fileName}?width=${width}&height=${height}&blurDataUrl=${base64url.fromBase64(
        blurDataURL as string
      )}`}
      className={styles.thumbContainer}
    >
      <Image
        src={src}
        width={MAX_WIDTH}
        height={newHeight}
        alt={`image for file - ${alt}`}
        blurDataURL={blurDataURL}
        {...props}
      />
    </Link>
  );
};

export default ImageThumb;
