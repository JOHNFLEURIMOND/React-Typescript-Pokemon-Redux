import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PokemonType } from "../types/pokemon";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<PokemonType, string>({
      query: (name) => `pokemon/${encodeURIComponent(name)}`,
    }),
  }),
});

export const { useLazyGetPokemonByNameQuery } = pokemonApi;
