"use server";

import React from "react";
import uniqid from "uniqid";

import { getImages } from "@/lib/actions";
import ImageThumb from "@/ui/gallery/ImageThumb/ImageThumb";
// import Image from "@/ui/components/Image/Image";

import type { NextPage } from "next";
import { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

import styles from "./page.module.scss";

const Page: NextPage<{
  params: Promise<{
    album: [];
  }>;
}> = async ({ params }: { params: Promise<{ album: string[] }> }) => {
  const albumPath = decodeURIComponent((await params).album.join("/"));
  const images = await getImages(albumPath);

  if ((images as ApiErrorResponse)?.error)
    throw Error((images as ApiErrorResponse)?.message, { cause: { status: (images as ApiErrorResponse)?.status } });

  return (
    <>
      <h1>{albumPath.split("/").reverse()[0]}</h1>
      <p>{albumPath}</p>
      <div className={styles.imagesContainer}>
        {(images as ImageDetails[])?.map(async (item: ImageDetails) => {
          const imageUrl = new URL(`${process.env.API_GET_IMAGE}/${albumPath}/${item.fileName}`, process.env.API);

          return (
            <>
              <ImageThumb
                key={uniqid()}
                src={imageUrl.href}
                width={item.details.width}
                height={item.details.height}
                alt={`image for file - ${item.fileName}`}
              />
            </>
          );
        })}
      </div>
    </>
  );
};

export default Page;
