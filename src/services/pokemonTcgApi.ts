import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
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

export type PokemonTcgServiceError = {
  kind: "rate-limit" | "upstream" | "network" | "invalid-query" | "unknown";
  message: string;
  status?: number;
  retryAfterMs?: number;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://api.pokemontcg.io/v2/",
});

const toHttpStatus = (
  status:
    | number
    | "CUSTOM_ERROR"
    | "FETCH_ERROR"
    | "PARSING_ERROR"
    | "TIMEOUT_ERROR"
    | undefined,
  error: unknown,
): number | undefined => {
  if (typeof status === "number") {
    return status;
  }

  if (
    status === "PARSING_ERROR" &&
    typeof error === "object" &&
    error !== null &&
    "originalStatus" in error
  ) {
    const originalStatus = (error as { originalStatus?: unknown })
      .originalStatus;
    if (typeof originalStatus === "number") {
      return originalStatus;
    }
  }

  return undefined;
};

const parseRetryAfterMs = (value: string | null): number | undefined => {
  if (!value) {
    return undefined;
  }

  const asSeconds = Number(value);
  if (Number.isFinite(asSeconds) && asSeconds > 0) {
    return Math.floor(asSeconds * 1000);
  }

  const asDateMs = Date.parse(value);
  if (Number.isNaN(asDateMs)) {
    return undefined;
  }

  const diff = asDateMs - Date.now();
  return diff > 0 ? diff : undefined;
};

const pokemonTcgBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  PokemonTcgServiceError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (!("error" in result)) {
    return result;
  }

  const retryAfterMs = parseRetryAfterMs(
    result.meta?.response?.headers.get("retry-after") ?? null,
  );
  const status = result.error?.status;
  const httpStatus = toHttpStatus(status, result.error);

  if (typeof httpStatus === "number") {
    if (httpStatus === 429) {
      return {
        error: {
          kind: "rate-limit",
          status: httpStatus,
          retryAfterMs,
          message:
            "Anonymous Pokemon TCG API rate limit reached. Please retry shortly.",
        },
      };
    }

    if (httpStatus >= 500 && httpStatus <= 599) {
      return {
        error: {
          kind: "upstream",
          status: httpStatus,
          retryAfterMs,
          message:
            "Pokemon TCG upstream service is temporarily unavailable. Please retry.",
        },
      };
    }

    if (httpStatus >= 400 && httpStatus <= 499) {
      return {
        error: {
          kind: "invalid-query",
          status: httpStatus,
          message:
            "Pokemon TCG rejected this request. Please adjust your search query.",
        },
      };
    }
  }

  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
    return {
      error: {
        kind: "network",
        message:
          "Pokemon TCG connection error. Please check your network and retry.",
      },
    };
  }

  return {
    error: {
      kind: "unknown",
      message: "Unable to load card results right now. Please retry.",
    },
  };
};

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
  baseQuery: pokemonTcgBaseQuery,
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
