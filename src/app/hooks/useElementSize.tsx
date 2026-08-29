import { useEffect, useState } from "react";

const useElementSize = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [elementSize, setElementSize] = useState<{ clientWidth: number; clientHeight: number }>({
    clientWidth: 0,
    clientHeight: 0,
  });

  useEffect(() => {
    if (!element) {
      setElementSize({ clientWidth: 0, clientHeight: 0 });
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setElementSize({
        clientWidth: entry.contentRect.width,
        clientHeight: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { ref: setElement, ...elementSize };
};

export default useElementSize;