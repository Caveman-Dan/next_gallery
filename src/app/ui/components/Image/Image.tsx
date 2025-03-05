"use client";

import NextImage, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

import fallbackImage from "@/assets/alert-triangle.svg?url";

export interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
}

const Image = ({ fallback = fallbackImage, alt, src, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return <NextImage alt={alt} onError={() => setError(false)} src={error ? fallback : src} {...props} />;
};

export default Image;
