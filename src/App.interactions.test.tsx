import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

const mockUseGetPokemonCatalogPageQuery = vi.hoisted(() => vi.fn());
const mockUseGetPokemonByNameQuery = vi.hoisted(() => vi.fn());
const mockUseLazyGetPokemonByNameQuery = vi.hoisted(() => vi.fn());
const mockUseSearchCardsQuery = vi.hoisted(() => vi.fn());

vi.mock("./services/pokemonApi", () => ({
  useGetPokemonCatalogPageQuery: mockUseGetPokemonCatalogPageQuery,
  useGetPokemonByNameQuery: mockUseGetPokemonByNameQuery,
  useLazyGetPokemonByNameQuery: mockUseLazyGetPokemonByNameQuery,
}));

vi.mock("./services/pokemonTcgApi", () => ({
  useSearchCardsQuery: mockUseSearchCardsQuery,
}));

type CatalogArgs = {
  limit: number;
  offset: number;
};

const PAGE_SIZE = 20;
const TOTAL_COUNT = 1351;

const createCatalogItems = (offset: number) => {
  const count = Math.min(PAGE_SIZE, Math.max(TOTAL_COUNT - offset, 0));

  return Array.from({ length: count }, (_, index) => {
    const id = offset + index + 1;

    return {
      id,
      name: `pokemon-${id}`,
      displayName: `Pokemon ${id}`,
      detailUrl: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      artwork: null,
      types: ["normal"],
      isDetailAvailable: true,
    };
  });
};

const setDefaultMocks = (): void => {
  mockUseGetPokemonCatalogPageQuery.mockImplementation(({ limit, offset }: CatalogArgs) => {
    const data = {
      items: createCatalogItems(offset),
      totalCount: TOTAL_COUNT,
      limit,
      offset,
      hasNextPage: offset + limit < TOTAL_COUNT,
      hasPreviousPage: offset > 0,
    };

    return {
      data,
      currentData: data,
      isLoading: false,
      isFetching: false,
      isError: false,
    };
  });

  mockUseGetPokemonByNameQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: undefined,
  });

  mockUseLazyGetPokemonByNameQuery.mockReturnValue([
    vi.fn(),
    {
      data: undefined,
      isFetching: false,
      isError: false,
      error: undefined,
    },
  ]);

  mockUseSearchCardsQuery.mockImplementation(({ query, page, pageSize }: { query: string; page: number; pageSize: number }) => ({
    data: {
      items: [
        {
          id: `${query}-card-${page}`,
          name: `Card ${query}`,
          supertype: "Pokemon",
          rarity: "Common",
          number: `${page}`,
          setName: "Test Set",
          imageSmall: null,
          imageLarge: null,
        },
      ],
      page,
      pageSize,
      totalCount: 16,
      hasPreviousPage: page > 1,
      hasNextPage: false,
    },
    isLoading: false,
    isFetching: false,
    isError: false,
    error: undefined,
  }));
};

const renderApp = (initialPath = "/?page=1") => {
  setDefaultMocks();
  const history = createMemoryHistory({ initialEntries: [initialPath] });

  render(
    <Router history={history}>
      <App />
    </Router>,
  );

  return history;
};

describe("App routing and interaction reactivity", () => {
  it("updates pagination results immediately without remounting", async () => {
    const history = renderApp("/?page=1");

    expect(screen.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText(/Showing 1 to 20 of 1351/)).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#20")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(history.location.search).toBe("?page=2");
      expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText(/Showing 21 to 40 of 1351/)).toBeInTheDocument();
      expect(screen.getByText("#21")).toBeInTheDocument();
      expect(screen.getByText("#40")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(history.location.search).toBe("?page=3");
      expect(screen.getByRole("button", { name: "Go to page 3" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText(/Showing 41 to 60 of 1351/)).toBeInTheDocument();
      expect(screen.getByText("#41")).toBeInTheDocument();
      expect(screen.getByText("#60")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    await waitFor(() => {
      expect(history.location.search).toBe("?page=2");
      expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText("#21")).toBeInTheDocument();
      expect(screen.getByText("#40")).toBeInTheDocument();
    });

    act(() => {
      history.goBack();
    });

    await waitFor(() => {
      expect(history.location.search).toBe("?page=3");
      expect(screen.getByRole("button", { name: "Go to page 3" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    act(() => {
      history.goForward();
    });

    await waitFor(() => {
      expect(history.location.search).toBe("?page=2");
      expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });

  it("switches between catalog and TCG routes via nav links with back/forward", async () => {
    const history = renderApp("/?page=1");

    fireEvent.click(screen.getByRole("link", { name: "TCG Cards" }));

    await waitFor(() => {
      expect(history.location.pathname).toBe("/cards");
      expect(screen.getByRole("heading", { name: "Pokemon TCG cards" })).toBeInTheDocument();
      expect(screen.queryByText(/Showing 1 to 20 of 1351/)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("link", { name: "Pokemon Catalog" }));

    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
      expect(screen.getByRole("heading", { name: "Pokemon catalog" })).toBeInTheDocument();
      expect(screen.getByText(/Showing 1 to 20 of 1351/)).toBeInTheDocument();
    });

    act(() => {
      history.goBack();
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/cards");
      expect(screen.getByRole("heading", { name: "Pokemon TCG cards" })).toBeInTheDocument();
    });

    act(() => {
      history.goForward();
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
      expect(screen.getByRole("heading", { name: "Pokemon catalog" })).toBeInTheDocument();
    });
  });

  it("applies scope filter behavior via mouse and keyboard and restores via back/forward", async () => {
    const history = renderApp("/?page=1");
    const scopeSelect = screen.getByLabelText("Search scope");

    fireEvent.mouseDown(scopeSelect);
    fireEvent.change(scopeSelect, { target: { value: "cards" } });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/cards");
      expect(screen.getByRole("heading", { name: "Pokemon TCG cards" })).toBeInTheDocument();
      expect(screen.getByLabelText("Search scope")).toHaveValue("cards");
    });

    const cardsScopeSelect = screen.getByLabelText("Search scope");
    cardsScopeSelect.focus();
    fireEvent.keyDown(cardsScopeSelect, { key: " ", code: "Space" });
    fireEvent.change(cardsScopeSelect, { target: { value: "pokemon" } });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
      expect(screen.getByRole("heading", { name: "Pokemon catalog" })).toBeInTheDocument();
      expect(screen.getByLabelText("Search scope")).toHaveValue("pokemon");
      expect(screen.getByText(/Showing 1 to 20 of 1351/)).toBeInTheDocument();
    });

    act(() => {
      history.goBack();
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/cards");
      expect(screen.getByRole("heading", { name: "Pokemon TCG cards" })).toBeInTheDocument();
      expect(screen.getByLabelText("Search scope")).toHaveValue("cards");
    });

    act(() => {
      history.goForward();
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
      expect(screen.getByRole("heading", { name: "Pokemon catalog" })).toBeInTheDocument();
      expect(screen.getByLabelText("Search scope")).toHaveValue("pokemon");
    });
  });
});
