import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { describe, expect, it, vi } from "vitest";
import PokemonCatalogPage from "./PokemonCatalogPage";

const mockUseGetPokemonCatalogPageQuery = vi.hoisted(() => vi.fn());

vi.mock("../services/pokemonApi", () => ({
  useGetPokemonCatalogPageQuery: mockUseGetPokemonCatalogPageQuery,
}));

vi.mock("../components/explorer/ExplorerSearch", () => ({
  ExplorerSearch: () => null,
}));

vi.mock("../components/explorer/PokemonPreviewCard", () => ({
  PokemonPreviewCard: ({ pokemon }: { pokemon: { id: number } }) => (
    <div data-testid="pokemon-id">#{pokemon.id}</div>
  ),
}));

interface QueryArgs {
  limit: number;
  offset: number;
}

const PAGE_SIZE = 20;
const TOTAL_COUNT = 151;

const createMockItems = (offset: number, totalCount: number) => {
  const remaining = Math.max(totalCount - offset, 0);
  const itemCount = Math.min(PAGE_SIZE, remaining);

  return Array.from({ length: itemCount }, (_, index) => {
    const id = offset + index + 1;

    return {
      id,
      name: `pokemon-${id}`,
      displayName: `Pokemon ${id}`,
      detailUrl: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      artwork: null,
      types: [],
      isDetailAvailable: true,
    };
  });
};

const setupHookMock = (): void => {
  mockUseGetPokemonCatalogPageQuery.mockImplementation(
    ({ limit, offset }: QueryArgs) => ({
      data: {
        items: createMockItems(offset, TOTAL_COUNT),
        totalCount: TOTAL_COUNT,
        limit,
        offset,
        hasNextPage: offset + limit < TOTAL_COUNT,
        hasPreviousPage: offset > 0,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    }),
  );
};

const renderPage = (search: string) => {
  setupHookMock();
  const history = createMemoryHistory({ initialEntries: [`/${search}`] });

  render(
    <Router history={history}>
      <PokemonCatalogPage />
    </Router>,
  );

  return history;
};

describe("PokemonCatalogPage URL pagination", () => {
  it("uses offset 0 for page 1 and renders page 1 summary", () => {
    renderPage("?page=1");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 0,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 1" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/Showing 1 to 20 of 151/)).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#20")).toBeInTheDocument();
  });

  it("uses offset 20 for page 2 and renders ids 21 through 40", () => {
    renderPage("?page=2");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 20,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/Showing 21 to 40 of 151/)).toBeInTheDocument();
    expect(screen.getByText("#21")).toBeInTheDocument();
    expect(screen.getByText("#40")).toBeInTheDocument();
  });

  it("uses offset 40 for page 3", () => {
    renderPage("?page=3");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 40,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 3" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("#41")).toBeInTheDocument();
    expect(screen.getByText("#60")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("uses offset 60 for page 4 and renders ids 61 through 80", () => {
    renderPage("?page=4");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 60,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 4" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/Showing 61 to 80 of 151/)).toBeInTheDocument();
    expect(screen.getByText("#61")).toBeInTheDocument();
    expect(screen.getByText("#80")).toBeInTheDocument();
  });

  it("renders a middle page with the correct calculated range", () => {
    renderPage("?page=5");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 80,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 5" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/Showing 81 to 100 of 151/)).toBeInTheDocument();
    expect(screen.getByText("#81")).toBeInTheDocument();
    expect(screen.getByText("#100")).toBeInTheDocument();
    expect(screen.getAllByText("...")).toHaveLength(1);
  });

  it("renders the final page with the remaining results", () => {
    renderPage("?page=8");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 140,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 8" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/Showing 141 to 151 of 151/)).toBeInTheDocument();
    expect(screen.getByText("#141")).toBeInTheDocument();
    expect(screen.getByText("#151")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("falls back safely to page 1 when page is invalid", () => {
    renderPage("?page=abc");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 0,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 1" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("falls back safely to page 1 when page is zero", () => {
    renderPage("?page=0");

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 0,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 1" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("clicking Next updates the URL and renders next page data", () => {
    const history = renderPage("?page=1");

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(history.location.search).toBe("?page=2");
    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 20,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("#21")).toBeInTheDocument();
    expect(screen.getByText("#40")).toBeInTheDocument();
  });

  it("clicking a numbered button updates URL and renders selected page", () => {
    const history = renderPage("?page=1");

    fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));

    expect(history.location.search).toBe("?page=3");
    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 40,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 3" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("#41")).toBeInTheDocument();
    expect(screen.getByText("#60")).toBeInTheDocument();
  });

  it("normalizes a page above final page to the final valid page", async () => {
    const history = renderPage("?page=999");

    await waitFor(() => {
      expect(history.location.search).toBe("?page=8");
    });

    expect(mockUseGetPokemonCatalogPageQuery).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 140,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 8" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/Showing 141 to 151 of 151/)).toBeInTheDocument();
  });
});
