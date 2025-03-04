"use client";

import NextImage from "next/image";
import { useState, useEffect } from "react";

import fallbackImage from "@/assets/alert-triangle.svg?url";

import type { NextImageProps } from "@/definitions/definitions";

interface ImageProps extends NextImageProps {
  fallback?: string;
}

const Image = ({ fallback = fallbackImage, alt, src, ...props }: ImageProps) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <NextImage
      alt={alt}
      onError={(e) => {
        // console.log("ERROR: ", e.target);
        setError(e);
      }}
      src={error ? fallback : src}
      {...props}
    />
  );
};

export default Image;
