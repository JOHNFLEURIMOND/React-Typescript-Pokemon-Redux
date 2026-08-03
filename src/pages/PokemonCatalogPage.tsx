import { useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExplorerSearch } from "../components/explorer/ExplorerSearch";
import { PaginationControls } from "../components/explorer/PaginationControls";
import { PokemonPreviewCard } from "../components/explorer/PokemonPreviewCard";
import { useGetPokemonCatalogPageQuery } from "../services/pokemonApi";
import { normalizePokemonSearch } from "../types/pokemon";

const PAGE_SIZE = 20;

const usePageNumber = (): number => {
  const { search } = useLocation();

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
  const pageFromUrl = usePageNumber();
  const offset = (pageFromUrl - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching, isError } =
    useGetPokemonCatalogPageQuery({
      limit: PAGE_SIZE,
      offset,
    });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;
  const page = Math.min(pageFromUrl, totalPages);

  useEffect(() => {
    if (page !== pageFromUrl) {
      const params = new URLSearchParams();
      params.set("page", String(page));
      history.replace(`/?${params.toString()}`);
    }
  }, [history, page, pageFromUrl]);

  const updatePage = (nextPage: number): void => {
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    history.push(`/?${params.toString()}`);
  };

  return (
    <section className="space-y-6">
      <ExplorerSearch
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
        {data && (
          <div className="text-sm text-slate-500">
            Showing {offset + 1} to{" "}
            {Math.min(offset + data.items.length, data.totalCount)} of{" "}
            {data.totalCount}
          </div>
        )}
      </div>

      {isLoading || isFetching ? (
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

      {data && data.items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No Pokemon found on this page.
        </div>
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((item) => (
              <PokemonPreviewCard key={item.id || item.name} pokemon={item} />
            ))}
          </div>

          <PaginationControls
            page={page}
            hasPreviousPage={data.hasPreviousPage}
            hasNextPage={data.hasNextPage}
            onPageChange={updatePage}
          />
        </>
      ) : null}
    </section>
  );
};

export default PokemonCatalogPage;
