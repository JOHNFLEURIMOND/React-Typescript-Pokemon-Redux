import { useEffect, useMemo, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { ExplorerSearch } from "../components/explorer/ExplorerSearch";
import { PokemonProfileView } from "../components/explorer/PokemonProfileView";
import { PokemonTcgCardTile } from "../components/explorer/PokemonTcgCardTile";
import {
  getQueryLengthBucket,
  trackAnalyticsEvent,
} from "../lib/googleAnalytics";
import { useGetPokemonByNameQuery } from "../services/pokemonApi";
import { useSearchCardsQuery } from "../services/pokemonTcgApi";
import { isPokemonServiceError } from "../types/pokemon.error";
import { normalizePokemonSearch } from "../types/pokemon";

interface DetailRouteParams {
  nameOrId: string;
}

const PokemonDetailPage = (): JSX.Element => {
  const history = useHistory();
  const { nameOrId } = useParams<DetailRouteParams>();
  const normalized = useMemo(
    () => normalizePokemonSearch(nameOrId),
    [nameOrId],
  );
  const lastTrackedDetailId = useRef<number | null>(null);
  const lastTrackedError = useRef<unknown>(null);

  const { data, isLoading, isError, error } = useGetPokemonByNameQuery(
    normalized,
    {
      skip: normalized.length === 0,
    },
  );

  const relatedCardsQuery = useSearchCardsQuery(
    {
      query: data?.displayName ?? "",
      page: 1,
      pageSize: 8,
    },
    {
      skip: !data,
    },
  );

  useEffect(() => {
    if (!data || lastTrackedDetailId.current === data.identity.id) return;
    lastTrackedDetailId.current = data.identity.id;
    trackAnalyticsEvent({
      event: "pokemon_detail_view",
      pokemon_id: String(data.identity.id),
      pokemon_type: data.types[0]?.name,
    });
  }, [data]);

  useEffect(() => {
    if (!isError || !error || lastTrackedError.current === error) return;
    lastTrackedError.current = error;
    const errorType = isPokemonServiceError(error) ? error.kind : "unknown";
    trackAnalyticsEvent({
      api_name: "pokeapi",
      error_type:
        errorType === "not-found"
          ? "not_found"
          : errorType === "network"
            ? "network"
            : "unknown",
      event: "pokemon_api_error",
      operation: "detail",
      request_status: errorType === "not-found" ? 404 : 0,
    });
  }, [error, isError]);

  return (
    <section className="space-y-6">
      <ExplorerSearch
        initialQuery={normalized}
        initialScope="pokemon"
        onSubmit={({ scope, query }) => {
          trackAnalyticsEvent({
            event: "pokemon_search",
            query_length_bucket: getQueryLengthBucket(query),
            search_scope: scope === "cards" ? "tcg" : "pokemon",
          });
          if (scope === "cards") {
            const params = new URLSearchParams();
            params.set("q", query.trim() || "pikachu");
            params.set("page", "1");
            history.push(`/cards?${params.toString()}`);
            return;
          }

          const nextValue = normalizePokemonSearch(query);
          if (nextValue) {
            history.push(`/pokemon/${encodeURIComponent(nextValue)}`);
          }
        }}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Pokemon detail
        </h1>
        <Link
          to="/"
          className="text-sm font-semibold text-sky-700 hover:text-sky-800"
        >
          Back to catalog
        </Link>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {isPokemonServiceError(error)
            ? error.message
            : "Unable to load this Pokemon profile right now."}
        </div>
      ) : null}

      {data ? <PokemonProfileView pokemon={data} /> : null}

      {data ? (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">
            Related Pokemon TCG cards
          </h2>
          {relatedCardsQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : null}
          {relatedCardsQuery.data && relatedCardsQuery.data.items.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCardsQuery.data.items.map((card) => (
                <PokemonTcgCardTile key={card.id} card={card} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default PokemonDetailPage;
