import { handleServerError } from "./errorHandling";
import { API_TIMEOUT_MS } from "./apiConfig";
import { apiError } from "./helpers";

import type { ApiErrorResponse } from "@/definitions/definitions";

export type FetchApiInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export const fetchApiJson = async <T>(
  url: URL,
  missingConfigMessage: string,
  init?: FetchApiInit
): Promise<T | ApiErrorResponse> => {
  if (!process.env.API) {
    handleServerError({ message: missingConfigMessage });
    return apiError(500, missingConfigMessage);
  }

  try {
    const response = await fetch(url, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message
          ? payload.message
          : `Request failed (${response.status})`;
      handleServerError({ message });
      return apiError(response.status, message);
    }

    if (payload == null) {
      const message = "API returned a non-JSON response";
      handleServerError({ message });
      return apiError(502, message);
    }

    return payload as T;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    const message = timedOut ? "The gallery API timed out" : "Could not reach the gallery API";
    handleServerError({ message });
    return apiError(timedOut ? 504 : 503, message);
  }
};
