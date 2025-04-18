export const capitalise = (string: string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export const randomInt = (num1: number, num2: number | undefined = undefined): number => {
  let min, max;

  if (!num2) {
    max = num1;
    min = 1;
  } else {
    max = num2;
    min = num1;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const cropPath = (pathString: string, depth: number) => {
  return decodeURIComponent(pathString).split("/").slice(0, depth).join("/");
};
