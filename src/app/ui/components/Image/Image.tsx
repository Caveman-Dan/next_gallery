"use client";

import NextImage, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

import fallbackImage from "@/assets/alert-triangle.svg?url";

import styles from "./Image.module.scss";

export interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
}

const Image = ({ fallback = fallbackImage, alt, src, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setError(false);
    setIsMounted(true);
  }, [src]);

  return (
    <div className={styles.root}>
      <div
        className={`${styles.blurContainer}${isLoading ? ` ${styles.isBlurred}` : ""}${
          isMounted ? ` ${styles.isVisible}` : ""
        }`}
      >
        <NextImage
          loading="lazy"
          onLoad={() => setTimeout(() => setIsLoading(false), 1000)}
          alt={alt}
          onError={() => setError(false)}
          src={error ? fallback : src}
          {...props}
        />
      </div>
    </div>
  );
};

export default Image;
