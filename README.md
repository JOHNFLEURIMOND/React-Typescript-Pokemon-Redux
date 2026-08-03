# Pokemon Explorer Catalog

Modern React and TypeScript Pokemon explorer with a paginated Pokemon catalog, detail routes, flippable preview cards, shiny toggles, and independent Pokemon TCG search.

## Product Direction

- Homepage is a paginated Pokemon catalog
- Search supports Pokemon and Trading Cards scopes
- Pokemon detail route renders one complete profile per selected Pokemon
- Abilities are rendered inside a single profile, not as card multipliers
- TCG results live in an independent route and pagination state

## Routes

- / : Pokemon catalog page with URL-based pagination
- /pokemon/:nameOrId : full Pokemon profile route
- /cards?q=pikachu&page=1 : TCG catalog route with independent pagination

## Tech Stack

- React 18 + TypeScript strict mode
- Vite 8 build pipeline
- Redux Toolkit + RTK Query
- Tailwind CSS + custom utility-first UI primitives
- Vitest + Testing Library

## Getting Started

Required Node.js version: >=22.12.0 <23

If you use nvm:

1. Activate the project version

   nvm use

1. Install dependencies

   npm install

1. Start local development

   npm run dev

1. Run validation

   npm run ci

## Scripts

- npm run dev : start Vite dev server
- npm run typecheck : run TypeScript checks
- npm run test : run Vitest watch mode
- npm run test:run : run tests once
- npm run build : typecheck + production build
- npm run format : apply Prettier formatting
- npm run format:check : validate formatting
- npm run ci : typecheck + tests + build + formatting check

## Deployment

- Netlify config is defined in netlify.toml
- Static output directory is dist
- SPA fallback redirect is configured for client-side routes

## CI

- GitHub Actions workflow: .github/workflows/ci.yml
- Validates install, typecheck, tests, build, and format checks

## GraphQL Pokemon Research

- Research note: docs/graphql-pokemon-research.md
- Conclusion: REST-first remains the best value for current milestone scope.
