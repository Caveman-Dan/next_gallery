"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { useParams } from "next/navigation";

import useElementSize from "@/hooks/useElementSize";
import { getImages } from "@/lib/actions";

import ImageSequencer from "@/ui/Album/ImageSequencer/ImageSequencer";
import Spinner from "@/ui/components/Spinner/Spinner";

import type { NextPage } from "next";
import { ImageDetails, ApiErrorResponse } from "@/definitions/definitions";

import styles from "./page.module.scss";

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
    <div className={styles.imagesContainer} ref={containerRef}>
      <div className={styles.titleContainer}>
        <h1>{albumPath.split("/").reverse()[0]}</h1>
        <p>{albumPath}</p>
      </div>
      {images.length ? (
        <ImageSequencer images={images} albumPath={albumPath} containerWidth={containerWidth} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Page;
