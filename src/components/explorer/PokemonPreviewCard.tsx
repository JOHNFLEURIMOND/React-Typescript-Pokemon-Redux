import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { PokemonCatalogReference } from "../../types/pokemon";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface PokemonPreviewCardProps {
  pokemon: PokemonCatalogReference;
}

const getSpriteFromId = (
  id: number,
): { defaultSprite: string; shinySprite: string } => {
  const idText = Number.isFinite(id) ? String(id) : "1";
  return {
    defaultSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idText}.png`,
    shinySprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${idText}.png`,
  };
};

export const PokemonPreviewCard = ({
  pokemon,
}: PokemonPreviewCardProps): JSX.Element => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (): void =>
      setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  const sprite = useMemo(() => {
    const sprites = getSpriteFromId(pokemon.id);
    if (isShiny) {
      return sprites.shinySprite;
    }

    return pokemon.artwork ?? sprites.defaultSprite;
  }, [isShiny, pokemon.artwork, pokemon.id]);

  const topStats = pokemon.stats?.slice(0, 3) ?? [];

  return (
    <Card className="group relative h-full min-h-[30rem] overflow-hidden">
      <div
        className="relative h-full min-h-[30rem]"
        style={{ perspective: "1200px" }}
      >
        <div
          className={`relative h-full min-h-[30rem] ${
            prefersReducedMotion ? "" : "transition-transform duration-500"
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform:
              prefersReducedMotion || !isFlipped
                ? "rotateY(0deg)"
                : "rotateY(180deg)",
          }}
        >
          <div
            className={`absolute inset-0 space-y-3 p-2 ${
              isFlipped ? "pointer-events-none" : ""
            }`}
            style={{ backfaceVisibility: "hidden" }}
            aria-hidden={isFlipped}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              #{pokemon.id}
            </div>
            <div className="mx-auto flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 via-amber-50 to-emerald-50">
              <img
                src={sprite}
                alt={pokemon.displayName}
                className="h-32 w-32 object-contain"
                loading="lazy"
              />
            </div>
            <CardTitle>{pokemon.displayName}</CardTitle>
            {!pokemon.isDetailAvailable ? (
              <div className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
                Details unavailable for this card right now.
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {pokemon.types.length > 0 ? (
                pokemon.types.map((typeName) => (
                  <span
                    key={typeName}
                    className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    {typeName}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  Loading types
                </span>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsFlipped((value) => !value)}
                aria-pressed={isFlipped}
                aria-label={isFlipped ? "Hide quick facts" : "Show quick facts"}
                tabIndex={isFlipped ? -1 : 0}
              >
                Quick facts
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsShiny((value) => !value)}
                aria-pressed={isShiny}
                aria-label={
                  isShiny ? "Show normal sprite" : "Show shiny sprite"
                }
                tabIndex={isFlipped ? -1 : 0}
              >
                {isShiny ? "Normal" : "Shiny"}
              </Button>
            </div>
            <Link
              to={`/pokemon/${pokemon.id}`}
              className="inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800"
              tabIndex={isFlipped ? -1 : 0}
            >
              View details
            </Link>
          </div>

          <div
            className={`absolute inset-0 space-y-3 rounded-2xl bg-slate-900 p-2 text-white ${
              isFlipped ? "" : "pointer-events-none"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: prefersReducedMotion
                ? "rotateY(0deg)"
                : "rotateY(180deg)",
              opacity: prefersReducedMotion ? (isFlipped ? 1 : 0) : 1,
            }}
            aria-hidden={!isFlipped}
          >
            <CardTitle className="text-white">{pokemon.displayName}</CardTitle>
            {pokemon.isDetailAvailable ? (
              <>
                <CardDescription className="text-slate-200">
                  Height {pokemon.height ?? "?"} | Weight{" "}
                  {pokemon.weight ?? "?"}
                </CardDescription>
                <div className="space-y-2 text-sm text-slate-100">
                  {pokemon.abilities && pokemon.abilities.length > 0 ? (
                    <div>
                      Abilities: {pokemon.abilities.slice(0, 3).join(", ")}
                      {pokemon.abilities.length > 3 ? "..." : ""}
                    </div>
                  ) : null}
                  {topStats.length > 0 ? (
                    <ul className="space-y-1">
                      {topStats.map((stat) => (
                        <li key={stat.name}>
                          {stat.name}: {stat.value}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </>
            ) : (
              <CardDescription className="text-slate-200">
                Quick facts are unavailable for this card. Open details to
                retry.
              </CardDescription>
            )}
            <div className="pt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsFlipped(false)}
                aria-pressed={!isFlipped}
                aria-label="Back to preview card"
                tabIndex={isFlipped ? 0 : -1}
              >
                Back to card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
