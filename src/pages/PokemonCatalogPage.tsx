import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ExplorerSearch } from "../components/explorer/ExplorerSearch";
import { PaginationControls } from "../components/explorer/PaginationControls";
import { PokemonPreviewCard } from "../components/explorer/PokemonPreviewCard";
import { useHistoryLocation } from "../lib/useHistoryLocation";
import { useGetPokemonCatalogPageQuery } from "../services/pokemonApi";
import { normalizePokemonSearch } from "../types/pokemon";

const PAGE_SIZE = 20;

const usePageNumber = (search: string): number => {
  return useMemo(() => {
    const params = new URLSearchParams(search);
    const raw = Number(params.get("page") ?? "1");

    if (!Number.isFinite(raw) || raw < 1) {
      return 1;
    }

    return Math.floor(raw);
  }, [search]);
};

const PokemonCatalogPage = (): JSX.Element => {
  const history = useHistory();
  const location = useHistoryLocation();
  const pageFromUrl = usePageNumber(location.search);
  const [knownTotalCount, setKnownTotalCount] = useState<number | null>(null);

  const knownTotalPages =
    knownTotalCount === null
      ? undefined
      : Math.max(1, Math.ceil(knownTotalCount / PAGE_SIZE));

  const pageForQuery =
    typeof knownTotalPages === "number"
      ? Math.min(pageFromUrl, knownTotalPages)
      : pageFromUrl;
  const offset = (pageForQuery - 1) * PAGE_SIZE;

  const { data, currentData, isLoading, isFetching, isError } =
    useGetPokemonCatalogPageQuery({
      limit: PAGE_SIZE,
      offset,
    });

  const pageData =
    isFetching && !currentData ? undefined : (currentData ?? data);

  useEffect(() => {
    if (pageData) {
      setKnownTotalCount(pageData.totalCount);
    }
  }, [pageData]);

  const totalPages = pageData
    ? Math.max(1, Math.ceil(pageData.totalCount / PAGE_SIZE))
    : knownTotalPages;
  const page =
    typeof totalPages === "number"
      ? Math.min(pageFromUrl, totalPages)
      : pageForQuery;
  const isNormalizingPage =
    typeof totalPages === "number" && page !== pageFromUrl;
  const displayOffset = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    if (typeof totalPages === "number" && page !== pageFromUrl) {
      const params = new URLSearchParams();
      params.set("page", String(page));
      history.replace(`/?${params.toString()}`);
    }
  }, [history, page, pageFromUrl, totalPages]);

  const updatePage = (nextPage: number): void => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(nextPage));
    history.push({
      pathname: location.pathname,
      search: `?${params.toString()}`,
    });
  };

  return (
    <section className="space-y-6">
      <ExplorerSearch
        initialScope="pokemon"
        onScopeChange={({ scope, query }) => {
          if (scope === "cards") {
            const params = new URLSearchParams();
            params.set("q", query.trim() || "pikachu");
            params.set("page", "1");
            history.push(`/cards?${params.toString()}`);
          }
        }}
        onSubmit={({ scope, query }) => {
          if (scope === "cards") {
            const params = new URLSearchParams();
            params.set("q", query.trim() || "pikachu");
            params.set("page", "1");
            history.push(`/cards?${params.toString()}`);
            return;
          }

          const normalized = normalizePokemonSearch(query);
          if (normalized) {
            history.push(`/pokemon/${encodeURIComponent(normalized)}`);
          }
        }}
      />

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Pokemon catalog
          </h1>
          <p className="text-sm text-slate-600">
            Browse paginated previews. Open details for full profile and related
            TCG cards.
          </p>
        </div>
        {pageData && !isNormalizingPage && (
          <div className="text-sm text-slate-500">
            Showing {displayOffset + 1} to{" "}
            {Math.min(
              displayOffset + pageData.items.length,
              pageData.totalCount,
            )}{" "}
            of {pageData.totalCount}
          </div>
        )}
      </div>

      {isLoading || isFetching || isNormalizingPage ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load Pokemon catalog right now. Try again.
        </div>
      ) : null}

      {pageData && pageData.items.length === 0 && !isNormalizingPage ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No Pokemon found on this page.
        </div>
      ) : null}

      {pageData && pageData.items.length > 0 && !isNormalizingPage ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageData.items.map((item) => (
              <PokemonPreviewCard key={item.id || item.name} pokemon={item} />
            ))}
          </div>

          <PaginationControls
            page={page}
            hasPreviousPage={pageData.hasPreviousPage}
            hasNextPage={pageData.hasNextPage}
            onPageChange={updatePage}
          />
        </>
      ) : null}
    </section>
  );
};

export default PokemonCatalogPage;
