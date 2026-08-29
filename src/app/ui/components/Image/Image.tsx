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
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSrc, setActiveSrc] = useState(src);
  const isClient = useIsClient();

  if (src !== activeSrc) {
    setActiveSrc(src);
    setError(false);
    setIsLoading(true);
  }

  return (
    <div className={styles.root}>
      <div
        className={`${styles.blurContainer}${isLoading ? ` ${styles.isBlurred}` : ""}${
          isClient ? ` ${styles.isVisible}` : ""
        }`}
      >
        <NextImage
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          alt={alt}
          src={error ? fallback : src}
          {...props}
        />
      </div>
    </div>
  );
};

export default Image;