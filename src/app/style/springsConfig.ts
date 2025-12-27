export type SpringConf = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
};

const springConfigs = {
  menuItems: {
    mass: 4,
    tension: 500,
    friction: 50,
    precision: 0.0,
  } as SpringConf,
  sideBar: {
    mass: 4,
    tension: 500,
    friction: 70,
    precision: 0.0,
  } as SpringConf,
  accordion: {
    mass: 4,
    tension: 500,
    friction: 60,
    precision: 0.0,
  } as SpringConf,
  modalAppear: {
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
  } as Record<"open" | "close", SpringConf>,
};

export const { menuItems, sideBar, accordion, modalAppear } = springConfigs;
