import { describe, expect, it } from "vitest";
import { mapPokeApiPokemon, toDisplayName } from "./pokemon.mapper";
import type { PokeApiPokemonDto } from "./pokemon";

const source: PokeApiPokemonDto = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  abilities: [
    {
      ability: { name: "static" },
      is_hidden: false,
      slot: 1,
    },
  ],
  stats: [
    {
      base_stat: 35,
      effort: 0,
      stat: { name: "hp" },
    },
  ],
  types: [
    {
      slot: 1,
      type: { name: "electric" },
    },
  ],
  sprites: {
    front_default: "default.png",
    front_shiny: "shiny.png",
    other: {
      "official-artwork": {
        front_default: "artwork.png",
      },
    },
  },
};

describe("mapPokeApiPokemon", () => {
  it("maps DTO to internal PokemonProfile", () => {
    const mapped = mapPokeApiPokemon(source);

    expect(mapped.identity.id).toBe(25);
    expect(mapped.displayName).toBe("Pikachu");
    expect(mapped.abilities[0].name).toBe("static");
    expect(mapped.stats[0].value).toBe(35);
    expect(mapped.types[0].name).toBe("electric");
    expect(mapped.sprites.artwork).toBe("artwork.png");
  });

  it("uses the shared display-name mapping format", () => {
    expect(toDisplayName("pikachu")).toBe("Pikachu");
    expect(toDisplayName("mr-mime")).toBe("Mr-mime");
  });

  it("handles missing optional artwork data consistently", () => {
    const withoutArtwork: PokeApiPokemonDto = {
      ...source,
      sprites: {
        front_default: null,
        front_shiny: null,
      },
    };

    const mapped = mapPokeApiPokemon(withoutArtwork);

    expect(mapped.sprites.default).toBeNull();
    expect(mapped.sprites.shiny).toBeNull();
    expect(mapped.sprites.artwork).toBeNull();
  });
});
