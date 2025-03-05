import Image, { ImageWithFallbackProps } from "@/ui/components/Image/Image";

import styles from "./ImageThumb.module.scss";

const ImageThumb = ({ src, width, height, alt, ...props }: ImageWithFallbackProps) => {
  const MAX_WIDTH = 200;
  const newHeight = (height / width) * MAX_WIDTH;

  return (
    <div className={styles.thumbContainer}>
      <Image src={src} width={MAX_WIDTH} height={newHeight} alt={`image for file - ${alt}`} {...props} />
    </div>
  );
};

export default ImageThumb;
