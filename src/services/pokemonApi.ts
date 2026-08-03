import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  normalizePokemonServiceError,
  type PokemonServiceError,
} from "../types/pokemon.error";
import { mapPokeApiPokemon, toDisplayName } from "../types/pokemon.mapper";
import {
  type PokemonCatalogPage,
  type PokemonCatalogQuery,
  type PokeApiResourceListDto,
  normalizePokemonSearch,
  type PokeApiPokemonDto,
  type PokemonProfile,
} from "../types/pokemon";

const parsePokemonIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : Number.NaN;
};

const safeCatalogId = (url: string): number => {
  const parsedId = parsePokemonIdFromUrl(url);
  return Number.isFinite(parsedId) ? parsedId : 0;
};

const rawBaseQuery = fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" });

const pokemonBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  PokemonServiceError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if ("error" in result) {
    return {
      error: normalizePokemonServiceError(result.error),
    };
  }

  return result;
};

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: pokemonBaseQuery,
  endpoints: (builder) => ({
    getPokemonCatalogPage: builder.query<
      PokemonCatalogPage,
      PokemonCatalogQuery
    >({
      queryFn: async ({ limit, offset }, _api, _extraOptions, baseQuery) => {
        const listResult = await baseQuery(
          `pokemon?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
        );

        if ("error" in listResult) {
          const normalizedError =
            listResult.error ?? normalizePokemonServiceError(undefined);

          return {
            error: normalizedError,
          };
        }

        const listData = listResult.data as PokeApiResourceListDto;

        // Intentional milestone strategy: fetch list first, then hydrate each visible
        // card with one detail request (1 list + N detail requests per page).
        const items = await Promise.all(
          listData.results.map(async (entry) => {
            const detailResult = await baseQuery(
              `pokemon/${encodeURIComponent(entry.name)}`,
            );

            if ("error" in detailResult) {
              return {
                id: safeCatalogId(entry.url),
                name: entry.name,
                displayName: toDisplayName(entry.name),
                detailUrl: entry.url,
                artwork: null,
                types: [],
                isDetailAvailable: false,
              };
            }

            const profile = mapPokeApiPokemon(
              detailResult.data as PokeApiPokemonDto,
            );

            return {
              id: profile.identity.id,
              name: profile.identity.name,
              displayName:
                profile.displayName || toDisplayName(profile.identity.name),
              detailUrl: entry.url,
              artwork: profile.sprites.artwork ?? profile.sprites.default,
              types: profile.types.map((typeEntry) => typeEntry.name),
              height: profile.height,
              weight: profile.weight,
              abilities: profile.abilities.map((ability) => ability.name),
              stats: profile.stats.map((stat) => ({
                name: stat.name,
                value: stat.value,
              })),
              isDetailAvailable: true,
            };
          }),
        );

        return {
          data: {
            items,
            totalCount: listData.count,
            limit,
            offset,
            hasNextPage: Boolean(listData.next),
            hasPreviousPage: Boolean(listData.previous),
          },
        };
      },
    }),
    getPokemonByName: builder.query<PokemonProfile, string>({
      query: (searchValue) => {
        const normalized = normalizePokemonSearch(searchValue);
        return `pokemon/${encodeURIComponent(normalized)}`;
      },
      transformResponse: (response: PokeApiPokemonDto): PokemonProfile =>
        mapPokeApiPokemon(response),
    }),
  }),
});

export const {
  useGetPokemonCatalogPageQuery,
  useGetPokemonByNameQuery,
  useLazyGetPokemonByNameQuery,
} = pokemonApi;
