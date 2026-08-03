import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { pokemonApi } from "./pokemonApi";

const createApiStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

const asJsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
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

const detailDto = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  abilities: [
    {
      ability: { name: "overgrow" },
      is_hidden: false,
      slot: 1,
    },
  ],
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: { name: "hp" },
    },
  ],
  types: [
    {
      slot: 1,
      type: { name: "grass" },
    },
  ],
  sprites: {
    front_default: "front.png",
    front_shiny: "shiny.png",
    other: {
      "official-artwork": {
        front_default: "artwork.png",
      },
    },
  },
};

describe("pokemonApi.getPokemonCatalogPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("preserves one catalog item per list reference when detail hydration partially fails", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        asJsonResponse({
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              name: "bulbasaur",
              url: "https://pokeapi.co/api/v2/pokemon/1/",
            },
            {
              name: "ivysaur",
              url: "https://pokeapi.co/api/v2/pokemon/2/",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(asJsonResponse(detailDto))
      .mockResolvedValueOnce(new Response("server error", { status: 500 }));

    const store = createApiStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonCatalogPage.initiate({
        limit: 2,
        offset: 0,
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const firstRequest = fetchMock.mock.calls[0]?.[0];
    expect(firstRequest).toBeDefined();

    expect(getRequestUrl(firstRequest as RequestInfo | URL)).toContain(
      "pokemon?limit=2&offset=0",
    );

    if (!("data" in result) || !result.data) {
      throw new Error("Expected successful catalog data");
    }

    expect(result.data.items).toHaveLength(2);
    expect(result.data.items[0]?.isDetailAvailable).toBe(true);
    expect(result.data.items[1]).toMatchObject({
      id: 2,
      name: "ivysaur",
      displayName: "Ivysaur",
      isDetailAvailable: false,
      types: [],
      artwork: null,
    });
  });
});
