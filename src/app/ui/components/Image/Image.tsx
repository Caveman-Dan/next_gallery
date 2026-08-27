"use client";

import NextImage, { ImageProps } from "next/image";
import { useState } from "react";

import useIsClient from "@/hooks/useIsClient";

import fallbackImage from "@/assets/alert-triangle.svg?url";

import styles from "./Image.module.scss";

export interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
}

const Image = ({ fallback = fallbackImage, alt, src, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSrc, setActiveSrc] = useState(src);
  const isMounted = useIsClient();

  if (src !== activeSrc) {
    setActiveSrc(src);
    setError(false);
    setIsLoading(true);
  }

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