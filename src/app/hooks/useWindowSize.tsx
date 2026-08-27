import { useSyncExternalStore } from "react";
import breakpoints from "@/style/breakpoints.json";

/**
 *    Breakpoints:
 *
 *    screen-sm: 576
 *    screen-md: 768
 *    screen-lg: 992
 *    screen-xl: 1200
 *    screen-xxl: 1600
 */

export type WindowSizes = "xsm" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface WindowSizeData {
  size?: WindowSizes;
  height?: number;
  width?: number;
  aboveSm?: boolean;
  belowSm?: boolean;
  aboveMd?: boolean;
  belowMd?: boolean;
  aboveLg?: boolean;
  belowLg?: boolean;
  aboveXl?: boolean;
  belowXl?: boolean;
  aboveXxl?: boolean;
  belowXxl?: boolean;
}

const size = (width: number): WindowSizes => {
  switch (true) {
    case width < breakpoints["screen-sm"]:
      return "xsm";
    case width >= breakpoints["screen-sm"] && width < breakpoints["screen-md"]:
      return "sm";
    case width >= breakpoints["screen-md"] && width < breakpoints["screen-lg"]:
      return "md";
    case width >= breakpoints["screen-lg"] && width < breakpoints["screen-xl"]:
      return "lg";
    case width >= breakpoints["screen-xl"] && width < breakpoints["screen-xxl"]:
      return "xl";
    default:
      return "xxl";
  }
};

const snapshotFromWidth = (width: number, height: number): WindowSizeData => ({
  size: size(width),
  height,
  width,
  aboveSm: width >= breakpoints["screen-sm"],
  belowSm: width < breakpoints["screen-sm"],
  aboveMd: width >= breakpoints["screen-md"],
  belowMd: width < breakpoints["screen-md"],
  aboveLg: width >= breakpoints["screen-lg"],
  belowLg: width < breakpoints["screen-lg"],
  aboveXl: width >= breakpoints["screen-xl"],
  belowXl: width < breakpoints["screen-xl"],
  aboveXxl: width >= breakpoints["screen-xxl"],
  belowXxl: width < breakpoints["screen-xxl"],
});

let cachedWidth = -1;
let cachedHeight = -1;
let cachedSnapshot: WindowSizeData = {};

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
};

const getSnapshot = (): WindowSizeData => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width === cachedWidth && height === cachedHeight) return cachedSnapshot;
  cachedWidth = width;
  cachedHeight = height;
  cachedSnapshot = snapshotFromWidth(width, height);
  return cachedSnapshot;
};

const getServerSnapshot = (): WindowSizeData => ({});

const useWindowSize = (): WindowSizeData => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useWindowSize;