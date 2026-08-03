import { describe, expect, it } from "vitest";
import {
  isPokemonServiceError,
  normalizePokemonServiceError,
} from "./pokemon.error";

describe("normalizePokemonServiceError", () => {
  it("maps HTTP 404 to not-found", () => {
    const error = normalizePokemonServiceError({
      status: 404,
      data: "not found",
    });

    expect(error.kind).toBe("not-found");
  });

  it("maps parsing 404 to not-found", () => {
    const error = normalizePokemonServiceError({
      status: "PARSING_ERROR",
      originalStatus: 404,
      data: "",
      error: "",
    });

    expect(error.kind).toBe("not-found");
  });

  it("maps fetch error to network", () => {
    const error = normalizePokemonServiceError({
      status: "FETCH_ERROR",
      error: "network",
    });

    expect(error.kind).toBe("network");
  });

  it("detects PokemonServiceError shape", () => {
    expect(
      isPokemonServiceError({
        kind: "unknown",
        message: "Something went wrong",
      }),
    ).toBe(true);
    expect(isPokemonServiceError({ kind: "unknown" })).toBe(false);
  });
});
