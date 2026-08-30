import { REVALIDATION_TAGS } from "./apiConfig";
import type { ApiErrorResponse } from "@/definitions/definitions";

export const apiError = (status: number, message: string): ApiErrorResponse => ({
  error: true,
  status,
  message,
});

export const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  typeof value === "object" && value !== null && !Array.isArray(value) && (value as ApiErrorResponse).error === true;

export const isGalleryCacheTag = (tag: string) => JSON.stringify(REVALIDATION_TAGS).includes(tag);

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

export const joinPath = (...parts: string[]) =>
  parts
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
