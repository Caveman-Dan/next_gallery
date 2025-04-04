import { useState, useEffect, useCallback } from "react";
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

export type WindowSizeData = {
  size?: string;
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
};

const size = (width: number): string => {
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

const useWindowSize = (): WindowSizeData => {
  const [windowSize, setWindowSize] = useState({});

  const handleResize = useCallback(
    () =>
      setWindowSize({
        size: size(window.innerWidth),
        height: window.innerHeight,
        width: window.innerWidth,
        aboveSm: window.innerWidth >= breakpoints["screen-sm"],
        belowSm: window.innerWidth < breakpoints["screen-sm"],
        aboveMd: window.innerWidth >= breakpoints["screen-md"],
        belowMd: window.innerWidth < breakpoints["screen-md"],
        aboveLg: window.innerWidth >= breakpoints["screen-lg"],
        belowLg: window.innerWidth < breakpoints["screen-lg"],
        aboveXl: window.innerWidth >= breakpoints["screen-xl"],
        belowXl: window.innerWidth < breakpoints["screen-xl"],
        aboveXxl: window.innerWidth >= breakpoints["screen-xxl"],
        belowXxl: window.innerWidth < breakpoints["screen-xxl"],
      }),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return windowSize;
};

export default useWindowSize;
