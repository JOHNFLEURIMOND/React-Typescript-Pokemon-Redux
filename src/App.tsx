import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import PokemonCatalogPage from "./pages/PokemonCatalogPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import PokemonTcgCatalogPage from "./pages/PokemonTcgCatalogPage";

const AppShell = ({ children }: { children: JSX.Element }): JSX.Element => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-slate-900"
        >
          Fleurimond Explorer
        </Link>
        <nav className="flex gap-3 text-sm font-semibold">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            Pokemon Catalog
          </Link>
          <Link
            to="/cards?q=pikachu&page=1"
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            TCG Cards
          </Link>
        </nav>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

    <footer className="mt-16 border-t border-slate-200 bg-white/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600">
        <div>Pokemon Explorer Catalog and TCG Search</div>
        <div className="flex gap-4">
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            PokeAPI
          </a>
          <a
            href="https://pokemontcg.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            Pokemon TCG API
          </a>
        </div>
      </div>
    </footer>
  </div>
);

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <AppShell>
            <PokemonCatalogPage />
          </AppShell>
        </Route>
        <Route path="/pokemon/:nameOrId" exact>
          <AppShell>
            <PokemonDetailPage />
          </AppShell>
        </Route>
        <Route path="/cards" exact>
          <AppShell>
            <PokemonTcgCatalogPage />
          </AppShell>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
