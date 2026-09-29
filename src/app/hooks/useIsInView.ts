import { useEffect, useRef, useState } from "react";

type InViewOptions = {
  threshold?: number;
  rootMargin?: string;
};

const useIsInView = <Target extends HTMLElement>(options?: InViewOptions) => {
  const ref = useRef<Target>(null);
  const [isInView, setIsInView] = useState(false);
  const threshold = options?.threshold ?? 0.2;
  const rootMargin = options?.rootMargin ?? "-8% 0px -8% 0px";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { isInView, ref };
};

export default useIsInView;
