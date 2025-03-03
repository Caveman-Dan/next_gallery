import type { DirectoryTree } from "directory-tree";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { SyntheticEvent } from "react";

export type InteractiveToggleProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
};

export interface GetAlbumsInterface extends DirectoryTree {
  custom: {
    id: string;
  };
}

export interface NextImageProps {
  src: string | StaticImport;
  alt: string;
  width?: number | string;
  height?: number | string;
  quality?: number;
  priority?: boolean;
  loading?: "eager" | "lazy";
  unoptimized?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  onLoadingComplete?: (img: HTMLImageElement) => void;
  onLoad?: () => void;
  onError?: (event: SyntheticEvent<HTMLImageElement>, error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  sizes?: string;
}
