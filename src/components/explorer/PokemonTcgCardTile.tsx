import type { PokemonTcgCard } from "../../types/pokemon.tcg";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface PokemonTcgCardTileProps {
  card: PokemonTcgCard;
}

export const PokemonTcgCardTile = ({
  card,
}: PokemonTcgCardTileProps): JSX.Element => (
  <Card className="space-y-3">
    <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50">
      {card.imageSmall ? (
        <img
          src={card.imageSmall}
          alt={card.name}
          className="h-52 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="text-sm text-slate-500">No image</div>
      )}
    </div>
    <CardTitle className="text-base">{card.name}</CardTitle>
    <CardDescription>
      {card.setName} • {card.rarity}
    </CardDescription>
    <div className="text-xs text-slate-500">
      {card.supertype} #{card.number}
    </div>
  </Card>
);
