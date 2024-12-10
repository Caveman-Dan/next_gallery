import { useEffect, useState, useRef } from "react";

const onSticky = (element: HTMLElement, callback: (isSticky: boolean) => void) => {
  if (!element) {
    return;
  }

  // console.log("HERE: ", element);

  const observer = new IntersectionObserver(
    (entry) => {
      // console.log("HERE: ", entry[0]);
      callback(entry[0].intersectionRatio < 1);
    },
    {
      threshold: [1],
      rootMargin: "-1px 0px 0px 0px",
    }
  );
  observer.observe(element);

  return { observer, element };
};

const useSticky = <Target extends HTMLElement>() => {
  const ref = useRef<Target>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const sticky = onSticky(ref.current, (isSticky: boolean) => {
      setIsSticky(isSticky);
      // console.log("CalledMe!");
    });
    return () => sticky?.observer.unobserve(sticky?.element);
  }, []);

  return { isSticky, ref };
};

export default useSticky;
