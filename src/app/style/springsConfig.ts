export type SpringConf = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
  style?: Record<string, string>;
  fade?: number;
};

export const menuItems = {
  mass: 4,
  tension: 500,
  friction: 50,
  precision: 0.0,
} as SpringConf;

export const sideBar = {
  mass: 4,
  tension: 500,
  friction: 70,
  precision: 0.0,
} as SpringConf;

export const accordion = {
  mass: 4,
  tension: 500,
  friction: 60,
  precision: 0.0,
} as SpringConf;

export const modalAppear = {
  open: {
    mass: 7,
    tension: 500,
    friction: 80,
    precision: 0.0,
  },
  close: {
    mass: 7,
    tension: 500,
    friction: 80,
    precision: 0.1,
  },
} as Record<"open" | "close", SpringConf>;

export const pageFade = {
  open: {
    mass: 10,
    tension: 800,
    friction: 110,
    precision: 0.0,
  },
  close: {
    mass: 7,
    tension: 500,
    friction: 80,
    precision: 0.1,
  },
} as Record<"open" | "close", SpringConf>;
