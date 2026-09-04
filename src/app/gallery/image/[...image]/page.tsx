// import base64url from "base64url";
import { getImages } from "@/lib/serverActions";
import { isApiErrorResponse } from "@/lib/helpers";
import Image from "@/ui/components/Image/Image";

import styles from "./page.module.scss";

const SingleImageView = async ({ params }: { params: Promise<{ image: string[] }> }) => {
  const segments = (await params).image.map((part) => decodeURIComponent(part));
  const fileName = segments.at(-1);
  const albumPath = segments.slice(0, -1).join("/");

  if (!fileName || !albumPath) {
    throw new Error("There was a problem retrieving the image.");
  }

  const response = await getImages(albumPath);
  if (isApiErrorResponse(response) || !Array.isArray(response)) {
    throw new Error("There was a problem retrieving the image.");
  }

  const image = response.find((entry) => entry.fileName === fileName);
  if (!image) {
    throw new Error("There was a problem retrieving the image.");
  }

  console.log("IMAGE: ", image);

  const imagePath = `${albumPath}/${fileName}`;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_GET_IMAGE}/${imagePath}`;

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
          alt={`Image of ${fileName}`}
          placeholder="blur"
          blurDataURL={image.placeholder.blurData}
        />
      </div>
    </div>
  );
};

export default SingleImageView;
