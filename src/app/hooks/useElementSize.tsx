import { useCallback, useEffect, useState } from "react";

const useElementSize = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [elementSize, setElementSize] = useState<{ clientWidth: number; clientHeight: number }>({
    clientWidth: 0,
    clientHeight: 0,
  });

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
    if (!node) {
      setElementSize({ clientWidth: 0, clientHeight: 0 });
    }
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setElementSize({
        clientWidth: entry.contentRect.width,
        clientHeight: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { ref, ...elementSize };
};

export default useElementSize;