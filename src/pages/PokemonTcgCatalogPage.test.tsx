import { fireEvent, render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { describe, expect, it, vi } from "vitest";
import PokemonTcgCatalogPage from "./PokemonTcgCatalogPage";

const mockUseSearchCardsQuery = vi.hoisted(() => vi.fn());

vi.mock("../services/pokemonTcgApi", () => ({
  useSearchCardsQuery: mockUseSearchCardsQuery,
}));

vi.mock("../components/explorer/ExplorerSearch", () => ({
  ExplorerSearch: () => null,
}));

vi.mock("../components/explorer/PokemonTcgCardTile", () => ({
  PokemonTcgCardTile: ({ card }: { card: { id: string } }) => (
    <div data-testid="tcg-card">{card.id}</div>
  ),
}));

type TcgQueryArgs = {
  query: string;
  page: number;
  pageSize: number;
};

const createCards = (
  query: string,
  page: number,
  pageSize: number,
  totalCount: number,
) => {
  const start = (page - 1) * pageSize;
  const count = Math.min(pageSize, Math.max(totalCount - start, 0));

  return Array.from({ length: count }, (_, index) => ({
    id: `${query}-card-${start + index + 1}`,
    name: `Card ${query}`,
    supertype: "Pokemon",
    rarity: "Common",
    number: `${start + index + 1}`,
    setName: "Base Set",
    imageSmall: null,
    imageLarge: null,
  }));
};

const setCardsSuccessMock = (totalCount = 80): void => {
  mockUseSearchCardsQuery.mockImplementation(
    ({ query, page, pageSize }: TcgQueryArgs) => ({
      data: {
        items: createCards(query, page, pageSize, totalCount),
        page,
        pageSize,
        totalCount,
        hasPreviousPage: page > 1,
        hasNextPage: page * pageSize < totalCount,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    }),
  );
};

const renderPage = (path = "/cards?q=pikachu&page=1") => {
  const history = createMemoryHistory({ initialEntries: [path] });

  render(
    <Router history={history}>
      <PokemonTcgCatalogPage />
    </Router>,
  );

  return history;
};

describe("PokemonTcgCatalogPage", () => {
  it("derives total pages from totalCount and pageSize", () => {
    setCardsSuccessMock(80);

    renderPage("/cards?q=pikachu&page=1");

    expect(
      screen.getByRole("button", { name: "Go to page 5" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to page 6" }),
    ).not.toBeInTheDocument();
  });

  it("clicking numbered pagination keeps query and updates page in URL", () => {
    setCardsSuccessMock(80);
    const history = renderPage("/cards?q=charizard&page=1");

    fireEvent.click(screen.getByRole("button", { name: "Go to page 4" }));

    expect(history.location.search).toBe("?q=charizard&page=4");
    expect(mockUseSearchCardsQuery).toHaveBeenLastCalledWith({
      query: "charizard",
      page: 4,
      pageSize: 16,
    });
    expect(
      screen.getByRole("button", { name: "Go to page 4" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("shows retry controls for retryable errors and calls refetch once", () => {
    const refetch = vi.fn();

    mockUseSearchCardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: {
        kind: "upstream",
        message:
          "Pokemon TCG upstream service is temporarily unavailable. Please retry.",
        status: 500,
      },
      refetch,
    });

    renderPage("/cards?q=pikachu&page=1");

    expect(
      screen.getByText(
        "Pokemon TCG upstream service is temporarily unavailable. Please retry.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("disables retry during retry-after cooldown", () => {
    mockUseSearchCardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: {
        kind: "rate-limit",
        message:
          "Anonymous Pokemon TCG API rate limit reached. Please retry shortly.",
        status: 429,
        retryAfterMs: 60_000,
      },
      refetch: vi.fn(),
    });

    renderPage("/cards?q=pikachu&page=1");

    const retryButton = screen.getByRole("button", { name: /Retry in \d+s/i });
    expect(retryButton).toBeDisabled();
  });

  it("does not render retry button for non-retryable invalid-query errors", () => {
    mockUseSearchCardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: {
        kind: "invalid-query",
        message:
          "Pokemon TCG rejected this request. Please adjust your search query.",
        status: 400,
      },
      refetch: vi.fn(),
    });

    renderPage("/cards?q=pikachu&page=1");

    expect(
      screen.getByText(
        "Pokemon TCG rejected this request. Please adjust your search query.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).not.toBeInTheDocument();
  });
});
