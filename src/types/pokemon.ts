export interface PokeApiPokemonDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    slot: number;
    type: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
}

export interface PokemonIdentity {
  id: number;
  name: string;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
  slot: number;
}

export interface PokemonStat {
  name: string;
  value: number;
  effort: number;
}

export interface PokemonType {
  name: string;
  slot: number;
}

export interface PokemonSprites {
  default: string | null;
  shiny: string | null;
  artwork: string | null;
}

export interface PokemonProfile {
  identity: PokemonIdentity;
  displayName: string;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  types: PokemonType[];
  sprites: PokemonSprites;
}

export interface PokemonCatalogQuery {
  limit: number;
  offset: number;
}

export interface PokeApiResourceListDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonCatalogReference {
  id: number;
  name: string;
  displayName: string;
  detailUrl: string;
  artwork: string | null;
  types: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
  stats?: Array<{
    name: string;
    value: number;
  }>;
  isDetailAvailable: boolean;
}

export interface PokemonCatalogPage {
  items: PokemonCatalogReference[];
  totalCount: number;
  limit: number;
  offset: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const normalizePokemonSearch = (value: string): string =>
  value.trim().toLowerCase();
