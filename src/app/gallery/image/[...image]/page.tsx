import base64url from "base64url";
import Image from "@/ui/components/Image/Image";

import styles from "./page.module.scss";
import path from "path";

const SingleImageView = async ({
  params,
  searchParams,
}: {
  params: Promise<{ image: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const imagePath = decodeURIComponent((await params).image.join("/"));
  const {
    blurDataUrl = "data:image_png;base64,_9j_2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj_2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj_wAARCAABAAEDASIAAhEBAxEB_8QAFQABAQAAAAAAAAAAAAAAAAAAAAP_xAAUEAEAAAAAAAAAAAAAAAAAAAAA_8QAFAEBAAAAAAAAAAAAAAAAAAAAAf_EABQRAQAAAAAAAAAAAAAAAAAAAAD_2gAMAwEAAhEDEQA_AKgAv__Z",
    width = 4000,
    height = 4000,
  } = await searchParams;
  const imageUrl = new URL(`${process.env.NEXT_PUBLIC_API_GET_IMAGE}/${imagePath}`, process.env.NEXT_PUBLIC_API);

  // Had to trim the last two "=" from the output of base64url.toBase64()
  const blurData = base64url.toBase64(blurDataUrl as string).slice(0, -2);

  const filename = path.basename(imagePath);

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <h1>{filename}</h1>
      </div>
      <div className={styles.imageContainer}>
        <Image
          className={styles.image}
          src={imageUrl.href}
          width={width as number}
          height={height as number}
          alt={`Image of ${filename}`}
          placeholder="blur"
          blurDataURL={blurData}
        />
      </div>
    </div>
  );
};

export default SingleImageView;
