import { useEffect, useState, type RefObject } from "react";

const useElementSize = (elementRef: RefObject<HTMLElement | null>) => {
  const [elementSize, setElementSize] = useState<{ clientWidth: number; clientHeight: number }>({
    clientWidth: 0,
    clientHeight: 0,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setElementSize({
        clientWidth: entry.contentRect.width,
        clientHeight: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return elementSize;
};

export default useElementSize;
