"use client";

import NextImage, { ImageProps } from "next/image";
import { useState } from "react";

import fallbackImage from "@/assets/alert-triangle.svg?url";

import styles from "./Image.module.scss";

export interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
}

const Image = ({
  fallback = fallbackImage,
  alt,
  src,
  blurDataURL,
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  if (src !== activeSrc) {
    setActiveSrc(src);
    setError(false);
    setLoaded(false);
  }

  return (
    <div className={styles.root}>
      {blurDataURL && !error && (
        <div
          className={styles.placeholder}
          style={{ backgroundImage: `url("${blurDataURL}")` }}
          aria-hidden
        />
      )}
      <NextImage
        {...props}
        loading="lazy"
        placeholder="empty"
        className={`${styles.image}${loaded ? ` ${styles.isLoaded}` : ""}${className ? ` ${className}` : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        alt={alt}
        src={error ? fallback : src}
      />
    </div>
  );
};

export default Image;