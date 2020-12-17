export const MARVEL_LOADING = "MARVEL_LOADING";
export const MARVEL_FAIL = "MARVEL_FAIL";
export const MARVEL_SUCCESS = "MARVEL_SUCCESS";

export type MarvelType = {
  abilities: MarvelCharacterAbility[],
  sprites: MarvelCharacterSprites,
  stats: MarvelCharacterStat[]
}

export type MarvelCharacterAbility = {
  ability: {
    name: string
    url: string
  }
}

export type MarvelCharacterSprites = {
  front_default: string
}

export type MarvelCharacterStat = {
  base_stat: number,
  stat: {
    name: string
  }
}

export interface MarvelLoading {
  type: typeof MARVEL_LOADING
}

export interface MarvelFail {
  type: typeof MARVEL_FAIL
}

export interface MarvelSuccess {
  type: typeof MARVEL_SUCCESS,
  payload: MarvelType
}

export type MarvelDispatchTypes = MarvelLoading | MarvelFail | MarvelSuccess