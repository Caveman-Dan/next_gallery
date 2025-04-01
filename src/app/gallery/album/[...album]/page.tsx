"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams } from "next/navigation";
import uniqid from "uniqid";

import { getImages } from "@/lib/actions";
import ImageThumb from "@/ui/Album/ImageThumb/ImageThumb";
import useElementSize from "@/hooks/useElementSize";

import type { NextPage } from "next";
import { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

import styles from "./page.module.scss";

const ImageSequencer = ({
  images,
  albumPath,
  containerWidth,
}: {
  images: ImageDetails[];
  albumPath: string;
  containerWidth: number | undefined;
}) => {
  return (
    <>
      <p>{containerWidth}</p>
      {(images as ImageDetails[])?.map((item: ImageDetails) => {
        const imageUrl = new URL(
          `${process.env.NEXT_PUBLIC_API_GET_IMAGE}/${albumPath}/${item.fileName}`,
          process.env.NEXT_PUBLIC_API
        );

        return (
          <>
            <ImageThumb
              key={item.fileName}
              src={imageUrl.href}
              srcWidth={item.details.width}
              srcHeight={item.details.height}
              thumbWidth={450}
              thumbHeight={225}
              alt={`image of ${item.fileName}`}
              placeholder="blur"
              blurDataURL={item.placeholder.blurData}
              albumPath={albumPath}
              fileName={item.fileName}
            />
          </>
        );
      })}{" "}
    </>
  );
};

const Page: NextPage = () => {
  // return null;
  const containerRef = useRef<HTMLDivElement>(null);
  const albumPath = decodeURIComponent(useParams<{ album: string[] }>().album.join("/"));
  const [images, setImages] = useState<ImageDetails[] | []>([]);

  const { clientWidth: containerWidth } = useElementSize(containerRef?.current);

  useLayoutEffect(() => {
    if (images.length && containerWidth) return;

    getImages(albumPath).then((response) => {
      if ((response as ApiErrorResponse)?.error) {
        throw Error((response as ApiErrorResponse)?.message, {
          cause: { status: (response as ApiErrorResponse)?.status },
        });
      } else {
        setImages(response as ImageDetails[]);
      }
    });
  }, [albumPath, containerWidth, images.length]);

  return (
    <>
      <div className={styles.titleContainer}>
        <h1>{albumPath.split("/").reverse()[0]}</h1>
        <p>{albumPath}</p>
      </div>
      <div className={styles.imagesContainer} ref={containerRef}>
        <ImageSequencer images={images} albumPath={albumPath} containerWidth={containerWidth} />
      </div>
    </>
  );
};

export default Page;
