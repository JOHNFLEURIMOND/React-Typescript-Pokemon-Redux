import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PokemonPreviewCard } from "./PokemonPreviewCard";

describe("PokemonPreviewCard", () => {
  it("uses accessible toggle semantics and suppresses focus on inactive face", () => {
    const { container } = render(
      <MemoryRouter>
        <PokemonPreviewCard
          pokemon={{
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
          }}
        />
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
