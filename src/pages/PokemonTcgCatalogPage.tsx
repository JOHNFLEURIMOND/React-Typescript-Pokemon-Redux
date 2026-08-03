import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ExplorerSearch } from "../components/explorer/ExplorerSearch";
import { useHistoryLocation } from "../lib/useHistoryLocation";
import { PaginationControls } from "../components/explorer/PaginationControls";
import { PokemonTcgCardTile } from "../components/explorer/PokemonTcgCardTile";
import {
  type PokemonTcgServiceError,
  useSearchCardsQuery,
} from "../services/pokemonTcgApi";
import { normalizePokemonSearch } from "../types/pokemon";

const useCardsQueryParams = (): { q: string; page: number } => {
  const { search } = useHistoryLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const q = params.get("q") ?? "pikachu";
    const page = Number(params.get("page") ?? "1");

    return {
      q,
      page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    };
  }, [search]);
};

const PokemonTcgCatalogPage = (): JSX.Element => {
  const history = useHistory();
  const { q, page } = useCardsQueryParams();
  const [retryBlockedUntil, setRetryBlockedUntil] = useState<number | null>(
    null,
  );
  const [now, setNow] = useState<number>(() => Date.now());

  const { data, isLoading, isFetching, isError, error, refetch } =
    useSearchCardsQuery({
      query: q,
      page,
      pageSize: 16,
    });

  const tcgError = error as PokemonTcgServiceError | undefined;
  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / data.pageSize))
    : 1;
  const retrySecondsRemaining = retryBlockedUntil
    ? Math.max(0, Math.ceil((retryBlockedUntil - now) / 1000))
    : 0;
  const canRetry = retrySecondsRemaining === 0;

  let tcgErrorMessage =
    "Unable to load card results right now. Try a different query.";
  let isRetryableError = false;

  if (tcgError) {
    tcgErrorMessage = tcgError.message;
    isRetryableError =
      tcgError.kind === "rate-limit" ||
      tcgError.kind === "upstream" ||
      tcgError.kind === "network";
  }

  useEffect(() => {
    if (!tcgError || !tcgError.retryAfterMs) {
      setRetryBlockedUntil(null);
      return;
    }

    setRetryBlockedUntil(Date.now() + tcgError.retryAfterMs);
  }, [tcgError]);

  useEffect(() => {
    if (!retryBlockedUntil) {
      return;
    }

    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 500);

    return () => {
      window.clearInterval(timerId);
    };
  }, [retryBlockedUntil]);

  useEffect(() => {
    if (retryBlockedUntil && Date.now() >= retryBlockedUntil) {
      setRetryBlockedUntil(null);
    }
  }, [retryBlockedUntil, now]);

  const setCardsLocation = (query: string, nextPage: number): void => {
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("page", String(nextPage));
    history.push(`/cards?${params.toString()}`);
  };

  return (
    <section className="space-y-6">
      <ExplorerSearch
        initialQuery={q}
        initialScope="cards"
        onScopeChange={({ scope }) => {
          if (scope === "pokemon") {
            history.push("/?page=1");
          }
        }}
        onSubmit={({ scope, query }) => {
          if (scope === "pokemon") {
            const normalized = normalizePokemonSearch(query);
            if (normalized) {
              history.push(`/pokemon/${encodeURIComponent(normalized)}`);
            }
            return;
          }

          setCardsLocation(query.trim() || "pikachu", 1);
        }}
      />

      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Pokemon TCG cards
        </h1>
        <p className="text-sm text-slate-600">
          Independent card search with standalone pagination and errors.
        </p>
      </div>

      {isLoading || isFetching ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div>{tcgErrorMessage}</div>
          {isRetryableError ? (
            <div className="mt-3">
              <button
                type="button"
                className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  if (!canRetry) {
                    return;
                  }
                  refetch();
                }}
                disabled={!canRetry || isFetching}
              >
                {canRetry
                  ? isFetching
                    ? "Retrying..."
                    : "Retry"
                  : `Retry in ${retrySecondsRemaining}s`}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {data && data.items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No cards found.
        </div>
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((card) => (
              <PokemonTcgCardTile key={card.id} card={card} />
            ))}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            hasPreviousPage={data.hasPreviousPage}
            hasNextPage={data.hasNextPage}
            onPageChange={(nextPage) => setCardsLocation(q, nextPage)}
          />
        </>
      ) : null}
    </section>
  );
};

export default PokemonTcgCatalogPage;
