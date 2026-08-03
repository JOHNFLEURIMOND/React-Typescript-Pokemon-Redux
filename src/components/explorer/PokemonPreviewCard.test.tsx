import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { PokemonCatalogReference } from "../../types/pokemon";
import { PokemonPreviewCard } from "./PokemonPreviewCard";

const buildPokemon = (
  overrides: Partial<PokemonCatalogReference> = {},
): PokemonCatalogReference => ({
  id: 25,
  name: "pikachu",
  displayName: "Pikachu",
  detailUrl: "https://pokeapi.co/api/v2/pokemon/25/",
  artwork: "artwork.png",
  types: ["electric"],
  height: 4,
  weight: 60,
  abilities: ["static", "lightning-rod"],
  stats: [
    { name: "hp", value: 35 },
    { name: "attack", value: 55 },
  ],
  isDetailAvailable: true,
  ...overrides,
});

describe("PokemonPreviewCard", () => {
  it("renders loading text when types are not available yet", () => {
    render(
      <MemoryRouter>
        <PokemonPreviewCard
          pokemon={buildPokemon({
            types: [],
          })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading types")).toBeInTheDocument();
  });

  it("renders a successful preview with mapped display name and details link", () => {
    render(
      <MemoryRouter>
        <PokemonPreviewCard
          pokemon={buildPokemon({
            id: 122,
            name: "mr-mime",
            displayName: "Mr Mime",
            types: ["psychic", "fairy"],
          })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("#122")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mr Mime" }),
    ).toBeInTheDocument();
    expect(screen.getByText("psychic")).toBeInTheDocument();
    expect(screen.getByText("fairy")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/pokemon/122",
    );
  });

  it("falls back to sprite URLs when artwork is missing and toggles shiny sprite", () => {
    const { container } = render(
      <MemoryRouter>
        <PokemonPreviewCard
          pokemon={buildPokemon({
            id: 7,
            artwork: null,
          })}
        />
      </MemoryRouter>,
    );

    const image = screen.getByRole("img", { name: "Pikachu" });
    expect(image).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    );

    fireEvent.click(screen.getByRole("button", { name: "Show shiny sprite" }));

    const shinyImage = container.querySelector('img[alt="Pikachu"]');
    expect(shinyImage).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png",
    );
  });

  it("handles missing optional quick-fact data with unavailable messaging", () => {
    render(
      <MemoryRouter>
        <PokemonPreviewCard
          pokemon={buildPokemon({
            isDetailAvailable: false,
            height: undefined,
            weight: undefined,
            abilities: undefined,
            stats: undefined,
          })}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Details unavailable for this card right now."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show quick facts" }));

    expect(
      screen.getByText(
        "Quick facts are unavailable for this card. Open details to retry.",
      ),
    ).toBeInTheDocument();
  });

  it("uses accessible toggle semantics and suppresses focus on inactive face", () => {
    const { container } = render(
      <MemoryRouter>
        <PokemonPreviewCard pokemon={buildPokemon()} />
      </MemoryRouter>,
    );

    const factsButton = screen.getByRole("button", {
      name: "Show quick facts",
    });
    const shinyButton = screen.getByRole("button", {
      name: "Show shiny sprite",
    });
    const detailsLink = screen.getByRole("link", { name: "View details" });

    expect(factsButton).toHaveAttribute("aria-pressed", "false");
    expect(shinyButton).toHaveAttribute("aria-pressed", "false");
    expect(detailsLink).toHaveAttribute("tabindex", "0");

    fireEvent.click(shinyButton);
    expect(
      screen.getByRole("button", { name: "Show normal sprite" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(factsButton);

    expect(
      container.querySelector('button[aria-label="Hide quick facts"]'),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Back to preview card" }),
    ).toHaveAttribute("tabindex", "0");
    expect(container.querySelector('a[href="/pokemon/25"]')).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByText(/Height 4 \| Weight 60/)).toBeInTheDocument();
  });
});
