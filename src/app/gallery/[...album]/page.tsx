"use server";

import Image from "next/image";
import React from "react";
import path from "path";
import uniqid from "uniqid";

import { getImages } from "@/lib/actions";

import type { NextPage } from "next";

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
        {images?.map((item: string) => {
          const imageUrl = new URL(`${process.env.API_GET_IMAGE}/${albumPath}/${item}`, process.env.API);
          return <Image key={uniqid()} src={imageUrl.href} width={200} height={200} alt={`image for file - ${item}`} />;
        })}
      </div>
    </>
  );
};

export default Page;
