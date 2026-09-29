"use client";

import { useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import useIsInView from "@/hooks/useIsInView";
import { homeReveal } from "@/style/springsConfig";

type SpringSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const fadeOut = { duration: 280 };
const entryDistance = 100;

const SpringSection = ({ children, className }: SpringSectionProps) => {
  const { isInView, ref } = useIsInView<HTMLElement>();
  const [spring, api] = useSpring(() => ({
    opacity: 0,
    y: entryDistance,
    config: homeReveal,
  }));

  useEffect(() => {
    if (isInView) {
      api.start({
        from: { opacity: 0, y: entryDistance },
        to: { opacity: 1, y: 0 },
        config: homeReveal,
      });
      return;
    }

    api.start({
      opacity: 0,
      config: fadeOut,
    });
  }, [api, isInView]);

  return (
    <section ref={ref} className={className}>
      <animated.div
        style={{
          opacity: spring.opacity,
          transform: spring.y.to((value) => `translate3d(0, ${value}px, 0)`),
        }}
      >
        {children}
      </animated.div>
    </section>
  );
};

export default SpringSection;
