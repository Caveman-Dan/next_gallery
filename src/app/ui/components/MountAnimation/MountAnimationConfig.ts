import { pageFade, modalAppear } from "@/style/springsConfig";
import type { SpringConf } from "@/style/springsConfig";

type MountAnimationConfig = {
  springs: SpringConf;
  style: Record<string, string>;
  fadeTime: number;
};

export type MountAnimationOptions = {
  open: MountAnimationConfig;
  close: MountAnimationConfig;
};

export const mainPageFade: MountAnimationOptions = {
  open: {
    springs: pageFade.open,
    style: {
      transform: "scale(1)",
    },
    fadeTime: 200,
  },
  close: {
    springs: pageFade.close,
    style: {
      transform: "scale(0.97)",
    },
    fadeTime: 200,
  },
};

export const loginTransition: MountAnimationOptions = {
  open: {
    springs: modalAppear.open,
    style: {
      transform: "scale(1)",
    },
    fadeTime: 400,
  },
  close: {
    springs: modalAppear.close,
    style: {
      transform: "scale(0)",
    },
    fadeTime: 400,
  },
};
