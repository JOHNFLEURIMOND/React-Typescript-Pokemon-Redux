export interface PokemonTcgCardDto {
  id: string;
  name: string;
  supertype?: string;
  rarity?: string;
  number?: string;
  set?: {
    name?: string;
  };
  images?: {
    small?: string;
    large?: string;
  };
}

export interface PokemonTcgSearchResponseDto {
  data: PokemonTcgCardDto[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export interface PokemonTcgCard {
  id: string;
  name: string;
  supertype: string;
  rarity: string;
  number: string;
  setName: string;
  imageSmall: string | null;
  imageLarge: string | null;
}

export interface PokemonTcgSearchArgs {
  query: string;
  page: number;
  pageSize: number;
}

export interface PokemonTcgSearchPage {
  items: PokemonTcgCard[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/;
const RESERVED_QUERY_CHARS = new Set<string>([
  "+",
  "-",
  "!",
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  "^",
  '"',
  "~",
  "*",
  "?",
  ":",
  "\\",
  "/",
  "&",
  "|",
]);

export const normalizeTcgSearchQuery = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

export const hasTcgControlCharacters = (value: string): boolean =>
  CONTROL_CHAR_PATTERN.test(value);

export const escapeTcgSearchQuery = (value: string): string => {
  let escaped = "";

  for (const char of value) {
    escaped += RESERVED_QUERY_CHARS.has(char) ? `\\${char}` : char;
  }

  return escaped;
};
