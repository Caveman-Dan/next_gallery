import { useState, useEffect } from "react";
import breakpoints from "@/style/breakpoints.json";

const useWindowSize = (customValue = null) => {
  const [windowSize, setWindowSize] = useState({
    height: undefined,
    width: undefined,
  });

  const handleResize = () =>
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
      ...(customValue && { aboveCust: window.innerWidth >= customValue, belowCust: window.innerWidth < customValue }),
    });

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
