import type { PokeApiPokemonDto, PokemonProfile } from "./pokemon";

const toDisplayName = (name: string): string =>
  `${name.charAt(0).toUpperCase()}${name.slice(1)}`;

export const mapPokeApiPokemon = (
  source: PokeApiPokemonDto,
): PokemonProfile => ({
  identity: {
    id: source.id,
    name: source.name,
  },
  displayName: toDisplayName(source.name),
  height: source.height,
  weight: source.weight,
  abilities: source.abilities.map((ability) => ({
    name: ability.ability.name,
    isHidden: ability.is_hidden,
    slot: ability.slot,
  })),
  stats: source.stats.map((stat) => ({
    name: stat.stat.name,
    value: stat.base_stat,
    effort: stat.effort,
  })),
  types: source.types.map((typeEntry) => ({
    name: typeEntry.type.name,
    slot: typeEntry.slot,
  })),
  sprites: {
    default: source.sprites.front_default,
    shiny: source.sprites.front_shiny,
    artwork: source.sprites.other?.["official-artwork"]?.front_default ?? null,
  },
});
