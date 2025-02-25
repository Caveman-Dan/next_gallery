import { readdir } from "node:fs/promises";
import path from "path";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  let images;
  const searchParams = request.nextUrl.searchParams;
  const locate = searchParams.get("locate");
  const imageFolder = path.join(`./${process.env.IMAGES_FOLDER}`, `${locate}/`);

  try {
    images = await readdir(imageFolder);
  } catch (err) {
    console.error("Error reading images directory: ", err);
  }

  return Response.json(images);
};
