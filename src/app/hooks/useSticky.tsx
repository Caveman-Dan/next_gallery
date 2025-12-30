import { useEffect, useState, useRef } from "react";

const onSticky = (element: HTMLElement, callback: (isSticky: boolean) => void) => {
  if (!element) {
    return;
  }

  const observer = new IntersectionObserver(
    (entry) => {
      callback(entry[0].intersectionRatio < 1);
    },
    {
      threshold: [0.99], // 1% threshold to cope with physics bouncing
      rootMargin: "-1px 0px 0px 0px", // -1px because the css sticky always sticks at top: 0
    }
  );
  observer.observe(element);

  return { observer, element };
};

const useSticky = <Target extends HTMLDivElement>() => {
  const ref = useRef<Target>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const sticky = onSticky(ref.current, (isSticky: boolean) => {
      setIsSticky(isSticky);
    });

    return () => sticky?.observer.unobserve(sticky?.element);
  }, []);

  return { isSticky, ref };
};

export default useSticky;
