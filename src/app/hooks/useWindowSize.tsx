import { useState, useEffect, useCallback } from "react";
import breakpoints from "@/style/breakpoints.json";

type WindowSizeData = {
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

const useWindowSize = (): WindowSizeData => {
  const [windowSize, setWindowSize] = useState({});

  const handleResize = useCallback(
    () =>
      setWindowSize({
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
