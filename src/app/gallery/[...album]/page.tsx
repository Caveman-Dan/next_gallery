"use server";

import React from "react";
import uniqid from "uniqid";

import { getImages } from "@/lib/actions";
import Image from "@/ui/components/Image/Image";

import type { NextPage } from "next";

const Page: NextPage<{
  params: Promise<{
    album: [];
  }>;
}> = async ({ params }: { params: Promise<{ album: string[] }> }) => {
  const albumPath = decodeURIComponent((await params).album.join("/"));
  const images = await getImages(albumPath);

  console.log("IMAGES: ", images);

  if (images.error) throw Error(images.message, { cause: { status: images.status } });

  return (
    <>
      <h1>{albumPath.split("/").reverse()[0]}</h1>
      <p>{albumPath}</p>
      <div>
        {images?.map(async (item: string) => {
          const imageUrl = new URL(`${process.env.API_GET_IMAGE}/${albumPath}/${item}`, process.env.API);

          return <Image key={uniqid()} src={imageUrl.href} width={200} height={200} alt={`image for file - ${item}`} />;
        })}
      </div>
    </>
  );
};

export default Page;
