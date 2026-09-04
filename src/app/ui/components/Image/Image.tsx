"use client";

import NextImage, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

import fallbackImage from "@/assets/alert-triangle.svg?url";

import styles from "./Image.module.scss";

export interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
  fit?: "cover" | "contain";
}

const Image = ({
  fallback = fallbackImage,
  alt,
  src,
  blurDataURL,
  className,
  fit = "cover",
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      setHidePlaceholder(loaded);
    }, 800);

    return () => clearTimeout(timer);
  }, [loaded]);

  // Reset state to allow src to change on this instance.
  // The new image is not treated as already loaded.
  if (src !== activeSrc) {
    setActiveSrc(src);
    setError(false);
    setLoaded(false);
    setHidePlaceholder(false);
  }

  return (
    <div className={styles.root}>
      {blurDataURL && !error && (
        <div
          className={`${styles.placeholder}
            ${fit === "contain" ? ` ${styles.contain}` : ""}
            ${hidePlaceholder ? ` ${styles.hidePlaceholder}` : ""}`}
          style={{ backgroundImage: `url("${blurDataURL}")` }}
          aria-hidden
        />
      )}
      <NextImage
        {...props}
        loading="lazy"
        placeholder="empty"
        className={`${styles.image}${fit === "contain" ? ` ${styles.contain}` : ""}${loaded ? ` ${styles.isLoaded}` : ""}${className ? ` ${className}` : ""}`}
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
