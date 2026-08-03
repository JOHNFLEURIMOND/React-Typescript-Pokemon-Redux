import { useState } from "react";
import type { PokemonProfile } from "../../types/pokemon";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

interface PokemonProfileViewProps {
  pokemon: PokemonProfile;
}

export const PokemonProfileView = ({
  pokemon,
}: PokemonProfileViewProps): JSX.Element => {
  const [showShiny, setShowShiny] = useState<boolean>(false);

  const sprite = showShiny
    ? (pokemon.sprites.shiny ??
      pokemon.sprites.artwork ??
      pokemon.sprites.default)
    : (pokemon.sprites.default ??
      pokemon.sprites.artwork ??
      pokemon.sprites.shiny);

  return (
    <Card className="grid gap-6 md:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50">
          {sprite ? (
            <img
              src={sprite}
              alt={pokemon.displayName}
              className="h-48 w-48 object-contain"
            />
          ) : (
            <div className="text-sm text-slate-600">No sprite available</div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowShiny((value) => !value)}
          aria-pressed={showShiny}
          aria-label={showShiny ? "Show normal sprite" : "Show shiny sprite"}
        >
          {showShiny ? "Show normal" : "Show shiny"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <CardTitle>
            {pokemon.displayName} #{pokemon.identity.id}
          </CardTitle>
          <div className="text-sm text-slate-600">{pokemon.identity.name}</div>
        </div>

        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            Height: {pokemon.height}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            Weight: {pokemon.weight}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Types
          </h4>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((typeEntry) => (
              <span
                key={typeEntry.name}
                className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800"
              >
                {typeEntry.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Abilities
          </h4>
          <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {pokemon.abilities.map((ability) => (
              <li key={ability.name} className="rounded-xl bg-slate-50 p-3">
                {ability.name}
                {ability.isHidden ? " (hidden)" : ""}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Stats
          </h4>
          <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {pokemon.stats.map((stat) => (
              <li key={stat.name} className="rounded-xl bg-slate-50 p-3">
                <span className="font-semibold">{stat.name}</span>: {stat.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
