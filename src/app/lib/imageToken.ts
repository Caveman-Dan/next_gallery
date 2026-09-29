import { createHmac } from "crypto";

const TTL_SECONDS = 10 * 60; // Time-to-live

const signingSecret = () => {
  const secret = process.env.IMAGE_SIGNING_SECRET;
  if (!secret) throw new Error("IMAGE_SIGNING_SECRET is not set");
  return secret;
};

export const signImagePath = (albumFilePath: string) => {
  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const signature = createHmac("sha256", signingSecret()).update(`${expires}\n${albumFilePath}`).digest("hex");
  return { expires, signature };
};

/** Public src used by next/image (same-origin rewrite to the API). */
export const signedImageSrc = (albumFilePath: string) => {
  const { expires, signature } = signImagePath(albumFilePath);
  const base = process.env.NEXT_PUBLIC_API_GET_IMAGE ?? process.env.API_GET_IMAGE ?? "/api/get_image";
  const path = albumFilePath.split("/").map(encodeURIComponent).join("/");
  return `${base}/${path}?exp=${expires}&sig=${signature}`;
};
