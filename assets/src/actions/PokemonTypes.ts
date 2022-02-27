export const POKEMON_LOADING = "POKEMON_LOADING";
export const POKEMON_FAIL = "POKEMON_FAIL";
export const POKEMON_SUCCESS = "POKEMON_SUCCESS";

export type PokemonType = {
  abilities: PokemonCharacterAbility[],
  sprites: PokemonCharacterSprites,
  stats: PokemonCharacterStat,
  moves: PokemonMoves
}

export type PokemonCharacterAbility = {
  ability: {
    name: string
    url: string
  }
}

export type PokemonCharacterSprites = {
  front_default: string
  front_shiny: string
}

export type PokemonCharacterStat = {
  base_stat: number,
  stat: {
    name: string
  }
}
export type PokemonMoves = {
  moves: string,
}

export interface PokemonLoading {
  type: typeof POKEMON_LOADING
}

export interface PokemonFail {
  type: typeof POKEMON_FAIL
}

export interface PokemonSuccess {
  type: typeof POKEMON_SUCCESS,
  payload: PokemonType
}

export type PokemonDispatchTypes = PokemonLoading | PokemonFail | PokemonSuccess