import { readdir } from "node:fs/promises";
import path from "path";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  let images;
  const locate = request.nextUrl.searchParams.get("locate") ?? "";
  const imageRoot = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    process.env.IMAGES_FOLDER ?? "",
  );
  const imageFolder = path.join(/* turbopackIgnore: true */ imageRoot, locate);

  try {
    images = await readdir(/* turbopackIgnore: true */ imageFolder);
  } catch (err) {
    console.error("Error reading images directory: ", err);
  }

  return Response.json(images);
};
