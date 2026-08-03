import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { pokemonTcgApi } from "./pokemonTcgApi";

const createApiStore = () =>
  configureStore({
    reducer: {
      [pokemonTcgApi.reducerPath]: pokemonTcgApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonTcgApi.middleware),
  });

const asTcgResponse = (): Response =>
  new Response(
    JSON.stringify({
      data: [],
      page: 1,
      pageSize: 20,
      count: 0,
      totalCount: 0,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

const asErrorResponse = (
  status: number,
  headers?: Record<string, string>,
): Response =>
  new Response("<html>Error</html>", {
    status,
    headers,
  });

const getRequestUrl = (input: RequestInfo | URL): string => {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
};

describe("pokemonTcgApi.searchCards", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("escapes reserved query characters and sends encoded URLSearchParams", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(asTcgResponse());

    const store = createApiStore();

    await store.dispatch(
      pokemonTcgApi.endpoints.searchCards.initiate({
        query: " Mr. Mime + pika/chu ",
        page: 1,
        pageSize: 20,
      }),
    );

    const firstCall = fetchMock.mock.calls[0]?.[0];
    expect(firstCall).toBeDefined();

    const url = new URL(getRequestUrl(firstCall as RequestInfo | URL));
    expect(url.pathname).toBe("/v2/cards");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("pageSize")).toBe("20");
    expect(url.searchParams.get("q")).toBe("name:*Mr. Mime \\+ pika\\/chu*");
  });

  it("rejects control-character input by issuing a safe empty-name query", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(asTcgResponse());

    const store = createApiStore();

    await store.dispatch(
      pokemonTcgApi.endpoints.searchCards.initiate({
        query: "pikachu\n",
        page: 2,
        pageSize: 10,
      }),
    );

    const firstCall = fetchMock.mock.calls[0]?.[0];
    expect(firstCall).toBeDefined();

    const url = new URL(getRequestUrl(firstCall as RequestInfo | URL));

    expect(url.searchParams.get("q")).toBe('name:""');
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("pageSize")).toBe("10");
  });

  it("maps 429 responses to rate-limit errors and parses retry-after seconds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      asErrorResponse(429, {
        "retry-after": "5",
      }),
    );

    const store = createApiStore();
    const args = { query: "pikachu", page: 1, pageSize: 20 };

    await store.dispatch(pokemonTcgApi.endpoints.searchCards.initiate(args));

    const state = pokemonTcgApi.endpoints.searchCards.select(args)(
      store.getState(),
    );

    expect(state.error).toMatchObject({
      kind: "rate-limit",
      status: 429,
    });

    const retryAfterMs = (state.error as { retryAfterMs?: number } | undefined)
      ?.retryAfterMs;

    expect(retryAfterMs).toBeGreaterThanOrEqual(5000);
    expect(retryAfterMs).toBeLessThan(6000);
  });

  it("maps 5xx responses to upstream errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(asErrorResponse(500));

    const store = createApiStore();
    const args = { query: "pikachu", page: 1, pageSize: 20 };

    await store.dispatch(pokemonTcgApi.endpoints.searchCards.initiate(args));

    const state = pokemonTcgApi.endpoints.searchCards.select(args)(
      store.getState(),
    );

    expect(state.error).toMatchObject({
      kind: "upstream",
      status: 500,
      message:
        "Pokemon TCG upstream service is temporarily unavailable. Please retry.",
    });
  });

  it("maps fetch failures to network errors", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("network down"),
    );

    const store = createApiStore();
    const args = { query: "pikachu", page: 1, pageSize: 20 };

    await store.dispatch(pokemonTcgApi.endpoints.searchCards.initiate(args));

    const state = pokemonTcgApi.endpoints.searchCards.select(args)(
      store.getState(),
    );

    expect(state.error).toMatchObject({
      kind: "network",
      message:
        "Pokemon TCG connection error. Please check your network and retry.",
    });
  });
});
