"use server";

import { Image } from "next/image";
import React from "react";
import path from "path";
import uniqid from "uniqid";

import { getImages } from "@/lib/actions";

import type { NextPage } from "next";

// const imageLoader = ({src, width, quality }) => `http://localhost:`

const Page: NextPage<{
  params: Promise<{
    album: [];
  }>;
}> = async ({ params }) => {
  const nextParams = await params;
  const albumPath = nextParams.album.reduce((accPath, item) => path.join(accPath, decodeURIComponent(item)), "");
  const images = await getImages(albumPath);

  return (
    <>
      <h1>{decodeURIComponent(nextParams.album[nextParams.album.length - 1])}</h1>
      <p>{albumPath}</p>
      <div>
        {images?.map((item) => (
          <h6 key={uniqid()}>{item}</h6>
          // <Image
          //   key={uniqid()}
          //   // src={path.join("/image_store/", albumPath, item)}
          //   src={"/image_store/Travelling 2004/Thailand & Laos/11 - Traveling through Laos/Picture 260.jpg"}
          //   fill
          //   alt={`image for file - ${item}`}
          // />
        ))}
      </div>
    </>
  );
};

export default Page;
