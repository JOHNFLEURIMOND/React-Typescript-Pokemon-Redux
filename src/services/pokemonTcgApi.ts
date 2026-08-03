import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  escapeTcgSearchQuery,
  hasTcgControlCharacters,
  normalizeTcgSearchQuery,
  type PokemonTcgCard,
  type PokemonTcgSearchArgs,
  type PokemonTcgSearchPage,
  type PokemonTcgSearchResponseDto,
} from "../types/pokemon.tcg";

const toInternalCard = (
  card: PokemonTcgSearchResponseDto["data"][number],
): PokemonTcgCard => ({
  id: card.id,
  name: card.name,
  supertype: card.supertype ?? "Unknown",
  rarity: card.rarity ?? "Unknown",
  number: card.number ?? "?",
  setName: card.set?.name ?? "Unknown set",
  imageSmall: card.images?.small ?? null,
  imageLarge: card.images?.large ?? null,
});

export const pokemonTcgApi = createApi({
  reducerPath: "pokemonTcgApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.pokemontcg.io/v2/" }),
  endpoints: (builder) => ({
    searchCards: builder.query<PokemonTcgSearchPage, PokemonTcgSearchArgs>({
      query: ({ query, page, pageSize }) => {
        const containsControlCharacters = hasTcgControlCharacters(query);
        const normalized = normalizeTcgSearchQuery(query);
        const escaped =
          normalized.length > 0 ? escapeTcgSearchQuery(normalized) : "";
        const q = containsControlCharacters
          ? 'name:""'
          : escaped.length > 0
            ? `name:*${escaped}*`
            : "name:*";

        const params = new URLSearchParams();
        params.set("q", q);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));

        return {
          url: `cards?${params.toString()}`,
        };
      },
      transformResponse: (
        response: PokemonTcgSearchResponseDto,
      ): PokemonTcgSearchPage => ({
        items: response.data.map(toInternalCard),
        page: response.page,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        hasPreviousPage: response.page > 1,
        hasNextPage: response.page * response.pageSize < response.totalCount,
      }),
    }),
  }),
});

export const { useSearchCardsQuery } = pokemonTcgApi;
