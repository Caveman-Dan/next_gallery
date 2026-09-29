import { notFound } from "next/navigation";
import { getImages } from "@/lib/serverActions";
import { isApiErrorResponse } from "@/lib/helpers";
import Image from "@/ui/components/Image/Image";

import styles from "./page.module.scss";

const SingleImageView = async ({ params }: { params: Promise<{ image: string[] }> }) => {
  const segments = (await params).image.map((part) => decodeURIComponent(part));
  const fileName = segments.at(-1);
  const albumPath = segments.slice(0, -1).join("/");

  if (!fileName || !albumPath) {
    notFound();
  }

  const response = await getImages(albumPath);
  if (isApiErrorResponse(response) || !Array.isArray(response)) {
    notFound();
  }

  const image = response.find((entry) => entry.fileName === fileName);
  if (!image || !image.src) {
    notFound();
  }

  const imageUrl = image.src;
  if (!imageUrl) {
    throw new Error("There was a problem retrieving the image.");
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <h1>{fileName}</h1>
      </div>
      <div className={styles.imageContainer}>
        <Image
          className={styles.image}
          src={imageUrl}
          // width={width as number}
          // height={height as number}
          fit="contain"
          fill
          sizes="(max-width: 768px) calc(100vw - 2 * var(--nav-spacing)), var(--page-width)"
          alt={`Image of ${fileName}`}
          placeholder="blur"
          blurDataURL={image.placeholder.blurData}
        />
      </div>
    </div>
  );
};

export default SingleImageView;
