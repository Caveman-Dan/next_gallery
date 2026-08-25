"use client";

import { useEffect } from "react";
import { useSpring, useSpringRef } from "@react-spring/web";
import { accordion as springsConfig } from "@/style/springsConfig";

/**
 * Animates the height of a section. Only used for root-level expanding layers.
 */
export function useSectionSpring(
  isSectionOpen: boolean,
  listHeight: number,
  depth: number,
  enabled: boolean
) {
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "0em" },
  });

  useEffect(() => {
    if (!enabled) return;

    api.start({
      to: {
        height: isSectionOpen ? `${(listHeight - depth) * 2}em` : "0em",
      },
      config: {
        ...springsConfig,
        clamp: !isSectionOpen,
      },
    });
  }, [api, depth, isSectionOpen, listHeight, enabled]);

  return springs;
}
