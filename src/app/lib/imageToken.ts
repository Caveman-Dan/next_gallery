import { createHmac } from "crypto";

const TTL_SECONDS = 10 * 60;

const signingSecret = () => {
  const secret = process.env.IMAGE_SIGNING_SECRET;
  if (!secret) throw new Error("IMAGE_SIGNING_SECRET is not set");
  return secret;
};

export const signImagePath = (albumFilePath: string) => {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const sig = createHmac("sha256", signingSecret()).update(`${exp}\n${albumFilePath}`).digest("hex");
  return { exp, sig };
};

/** Public src used by next/image (same-origin rewrite to the API). */
export const signedImageSrc = (albumFilePath: string) => {
  const { exp, sig } = signImagePath(albumFilePath);
  const base = process.env.NEXT_PUBLIC_API_GET_IMAGE ?? process.env.API_GET_IMAGE ?? "/api/get_image";
  const path = albumFilePath.split("/").map(encodeURIComponent).join("/");
  return `${base}/${path}?exp=${exp}&sig=${sig}`;
};
