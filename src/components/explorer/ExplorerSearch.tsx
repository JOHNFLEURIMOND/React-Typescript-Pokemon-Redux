import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

export type ExplorerScope = "pokemon" | "cards";

interface ExplorerSearchProps {
  initialQuery?: string;
  initialScope?: ExplorerScope;
  onSubmit: (payload: { scope: ExplorerScope; query: string }) => void;
}

export const ExplorerSearch = ({
  initialQuery = "",
  initialScope = "pokemon",
  onSubmit,
}: ExplorerSearchProps): JSX.Element => {
  const [scope, setScope] = useState<ExplorerScope>(initialScope);
  const [query, setQuery] = useState<string>(initialQuery);

  return (
    <form
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[180px_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ scope, query });
      }}
    >
      <Select
        aria-label="Search scope"
        value={scope}
        onChange={(event) => setScope(event.target.value as ExplorerScope)}
      >
        <option value="pokemon">Pokemon</option>
        <option value="cards">Trading Cards</option>
      </Select>
      <Input
        aria-label="Search query"
        placeholder={
          scope === "pokemon"
            ? "Search by name or Pokedex number"
            : "Search trading cards"
        }
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Button type="submit">Search</Button>
    </form>
  );
};
