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
});
