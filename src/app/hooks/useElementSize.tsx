import { useState, useEffect, useCallback } from "react";

const useElementSize = (element: HTMLElement | null) => {
  const [elementSize, setElementSize] = useState<{ clientWidth: number; clientHeight: number }>({
    clientWidth: 0,
    clientHeight: 0,
  });

  const handleResize = useCallback(
    () =>
      setElementSize({
        clientWidth: element?.clientWidth || 0,
        clientHeight: element?.clientHeight || 0,
      }),
    [element?.clientHeight, element?.clientWidth]
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return elementSize;
};

export default useElementSize;
