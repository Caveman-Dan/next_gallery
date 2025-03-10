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

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div className={styles.root}>
      <div className={`${styles.blurContainer}${isLoading ? ` ${styles.blurred}` : ""}`}>
        <NextImage
          loading="lazy"
          onLoad={() => setIsLoading(false)}
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
