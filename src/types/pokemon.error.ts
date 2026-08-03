import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type PokemonServiceError =
  | {
      kind: "not-found";
      message: string;
    }
  | {
      kind: "network";
      message: string;
    }
  | {
      kind: "unknown";
      message: string;
    };

const NOT_FOUND_MESSAGE = "Pokemon not found. Please try another name or ID.";
const NETWORK_MESSAGE =
  "Unable to reach the Pokemon service. Please try again.";
const UNKNOWN_MESSAGE = "Something went wrong. Please try again.";

const isNumericStatus = (
  status: FetchBaseQueryError["status"],
): status is number => typeof status === "number";

export const normalizePokemonServiceError = (
  error: FetchBaseQueryError | undefined,
): PokemonServiceError => {
  if (!error) {
    return {
      kind: "unknown",
      message: UNKNOWN_MESSAGE,
    };
  }

  if (isNumericStatus(error.status) && error.status === 404) {
    return {
      kind: "not-found",
      message: NOT_FOUND_MESSAGE,
    };
  }

  if (error.status === "PARSING_ERROR" && error.originalStatus === 404) {
    return {
      kind: "not-found",
      message: NOT_FOUND_MESSAGE,
    };
  }

  if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
    return {
      kind: "network",
      message: NETWORK_MESSAGE,
    };
  }

  return {
    kind: "unknown",
    message: UNKNOWN_MESSAGE,
  };
};

export const isPokemonServiceError = (
  error: unknown,
): error is PokemonServiceError => {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (!("kind" in error) || !("message" in error)) {
    return false;
  }

  return (
    error.kind === "not-found" ||
    error.kind === "network" ||
    error.kind === "unknown"
  );
};
