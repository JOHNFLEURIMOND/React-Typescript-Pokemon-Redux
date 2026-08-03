import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PokeApiPokemonDto, PokemonProfile } from "../types/pokemon";

const asJsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const createApiStore = async () => {
  const { pokemonApi } = await import("./pokemonApi");

  const store = configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

  return { store, pokemonApi };
};

const detailDto: PokeApiPokemonDto = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  abilities: [
    {
      ability: { name: "static" },
      is_hidden: false,
      slot: 1,
    },
  ],
  stats: [
    {
      base_stat: 35,
      effort: 0,
      stat: { name: "hp" },
    },
  ],
  types: [
    {
      slot: 1,
      type: { name: "electric" },
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

describe("pokemonApi mapping consistency", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("passes detail endpoint responses through mapPokeApiPokemon", async () => {
    const mappedProfile: PokemonProfile = {
      identity: { id: 25, name: "pikachu" },
      displayName: "Mapped Pikachu",
      height: 4,
      weight: 60,
      abilities: [{ name: "static", isHidden: false, slot: 1 }],
      stats: [{ name: "hp", value: 35, effort: 0 }],
      types: [{ name: "electric", slot: 1 }],
      sprites: {
        default: "front.png",
        shiny: "shiny.png",
        artwork: "artwork.png",
      },
    };

    const mapSpy = vi.fn(() => mappedProfile);

    vi.doMock("../types/pokemon.mapper", () => ({
      mapPokeApiPokemon: mapSpy,
      toDisplayName: (name: string) => name,
    }));

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      asJsonResponse(detailDto),
    );

    const { store, pokemonApi } = await createApiStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate("Pikachu"),
    );

    expect(mapSpy).toHaveBeenCalledTimes(1);
    expect(mapSpy).toHaveBeenCalledWith(detailDto);

    if (!("data" in result) || !result.data) {
      throw new Error("Expected detail endpoint to return data");
    }

    expect(result.data).toEqual(mappedProfile);
  });

  it("uses toDisplayName for catalog fallback entries and mapper output for hydrated entries", async () => {
    const mapSpy = vi.fn((source: PokeApiPokemonDto): PokemonProfile => ({
      identity: {
        id: source.id,
        name: source.name,
      },
      displayName: `Mapped:${source.name}`,
      height: source.height,
      weight: source.weight,
      abilities: source.abilities.map((ability) => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden,
        slot: ability.slot,
      })),
      stats: source.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
        effort: stat.effort,
      })),
      types: source.types.map((typeEntry) => ({
        name: typeEntry.type.name,
        slot: typeEntry.slot,
      })),
      sprites: {
        default: source.sprites.front_default,
        shiny: source.sprites.front_shiny,
        artwork:
          source.sprites.other?.["official-artwork"]?.front_default ?? null,
      },
    }));

    const toDisplayNameSpy = vi.fn((name: string) => `Shared:${name}`);

    vi.doMock("../types/pokemon.mapper", () => ({
      mapPokeApiPokemon: mapSpy,
      toDisplayName: toDisplayNameSpy,
    }));

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        asJsonResponse({
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              name: "pikachu",
              url: "https://pokeapi.co/api/v2/pokemon/25/",
            },
            {
              name: "mr-mime",
              url: "https://pokeapi.co/api/v2/pokemon/122/",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(asJsonResponse(detailDto))
      .mockResolvedValueOnce(new Response("server error", { status: 500 }));

    const { store, pokemonApi } = await createApiStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonCatalogPage.initiate({
        limit: 2,
        offset: 0,
      }),
    );

    expect(mapSpy).toHaveBeenCalledTimes(1);
    expect(toDisplayNameSpy).toHaveBeenCalledTimes(1);
    expect(toDisplayNameSpy).toHaveBeenCalledWith("mr-mime");

    if (!("data" in result) || !result.data) {
      throw new Error("Expected catalog endpoint to return data");
    }

    expect(result.data.items[0]?.displayName).toBe("Mapped:pikachu");
    expect(result.data.items[1]).toMatchObject({
      id: 122,
      name: "mr-mime",
      displayName: "Shared:mr-mime",
      isDetailAvailable: false,
      types: [],
      artwork: null,
    });
  });

  it("keeps mapped catalog and detail outputs aligned for the same DTO", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        asJsonResponse({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              name: "pikachu",
              url: "https://pokeapi.co/api/v2/pokemon/25/",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(asJsonResponse(detailDto))
      .mockResolvedValueOnce(asJsonResponse(detailDto));

    const { store, pokemonApi } = await createApiStore();
    const catalogResult = await store.dispatch(
      pokemonApi.endpoints.getPokemonCatalogPage.initiate({
        limit: 1,
        offset: 0,
      }),
    );
    const detailResult = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate("pikachu"),
    );

    if (!("data" in catalogResult) || !catalogResult.data) {
      throw new Error("Expected catalog endpoint to return data");
    }

    if (!("data" in detailResult) || !detailResult.data) {
      throw new Error("Expected detail endpoint to return data");
    }

    const catalogItem = catalogResult.data.items[0];
    const detailData = detailResult.data;

    expect(catalogItem).toBeDefined();
    expect(catalogItem?.displayName).toBe(detailData.displayName);
    expect(catalogItem?.name).toBe(detailData.identity.name);
    expect(catalogItem?.types).toEqual(
      detailData.types.map((typeEntry) => typeEntry.name),
    );
    expect(catalogItem?.height).toBe(detailData.height);
    expect(catalogItem?.weight).toBe(detailData.weight);
    expect(catalogItem?.abilities).toEqual(
      detailData.abilities.map((ability) => ability.name),
    );
    expect(catalogItem?.stats).toEqual(
      detailData.stats.map((stat) => ({ name: stat.name, value: stat.value })),
    );
    expect(catalogItem?.artwork).toBe(
      detailData.sprites.artwork ?? detailData.sprites.default,
    );
  });
});
