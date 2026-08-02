# Modernization Baseline

Date: 2026-08-02

## Checklist
- [x] Confirm repository and branch safety
- [x] Inspect manifest and config files
- [x] Trace active render flow
- [x] Trace Redux and PokeAPI flow
- [x] Inspect legacy backend and dead-code candidates
- [x] Inspect Storybook status
- [x] Attempt baseline install and script validation
- [x] Capture browser observations from the deployed app

## Confirmed Findings
- Current branch: `security/remove-exposed-credentials`
- Repository root was confirmed locally via `git rev-parse --show-toplevel`
- Working tree is clean
- Remote `origin` points to the GitHub repository and the remote default branch is `main`
- Runtime versions: Node `v22.23.1`, npm `10.9.8`
- The active app is still the legacy React + Redux + TypeScript + Webpack + Semantic UI + Emotion stack
- The deployed app loads at `https://typescript-pokemon-api.netlify.app/`
- A local `.env` file existed during baseline inspection
- `assets/src/Heros/Icons.tsx` was the remaining tracked legacy file inspected in this area
- `assets/src/actions/PokemonActions.ts` calls the PokeAPI directly through Axios
- Storybook stories exist, but there is no Storybook dependency set or Storybook script in `package.json`

## Assumptions
- The local production build is not currently verifiable because `npm ci` failed before the existing tooling could be exercised
- The Netlify deployment is assumed to represent the current public baseline for user-visible behavior
- `assets/src/Heros` is assumed to be dead or abandoned feature code until a later phase proves a reachable render path

## Baseline Command Results
- `git status`: clean working tree
- `git branch --show-current`: `security/remove-exposed-credentials`
- `git branch --all`: local `main`, current feature branch, and matching remote branches
- `git remote -v`: `origin` points to the GitHub repository for fetch and push
- `git rev-parse --show-toplevel`: repository root confirmed
- `git rev-parse HEAD`: `43f9e5eec931700a47509b7c0ff8d4fa324fc123`
- `node --version`: `v22.23.1`
- `npm --version`: `10.9.8`
- `npm ci`: failed with npm `403 Forbidden` while fetching `https://registry.npmjs.org/react`; exit code `1`
- `npm run`: available scripts are `prettier`, `build`, and `dev`
- `npm run dev`: failed immediately because `webpack-dev-server` was not available in the active install state
- `npm run build`: not attempted because the install step did not succeed

## Current Architecture
### Entry Flow
`index.html` -> `assets/Main.js` -> `assets/App.tsx` -> `assets/src/CharacterPage/CharacterPage.tsx` -> `assets/src/SearchBar/SearchBar.tsx` -> Redux thunk -> PokeAPI -> reducer -> search result cards

### Active Render Flow
- `assets/Main.js` mounts `<App />` into `#root` with a Redux `Provider`
- `assets/App.tsx` wraps the app in `BrowserRouter` and renders only the `/` route
- The homepage renders `Nav`, `CharacterPage`, and `Footer`
- `CharacterPage` renders `SearchBar` inside an animated container
- `SearchBar` owns the input, dispatches the search action, and renders Pokémon cards from Redux state

### Redux Flow
- `assets/Store.ts` creates the store with `createStore`, `applyMiddleware(thunk)`, and `redux-devtools-extension`
- `assets/src/reducers/RootReducer.ts` combines only the `pokemon` reducer
- `assets/src/reducers/PokemonReducer.ts` stores `loading` plus an optional `pokemon` payload
- `assets/src/actions/PokemonActions.ts` dispatches loading, success, and fail actions around the async request
- `assets/src/actions/PokemonTypes.ts` defines the action types and the current Pokémon response shape

### API Flow
- The active search request is `axios.get('https://pokeapi.co/api/v2/pokemon/${Character}')`

## Current Build Flow
- `build` currently maps to `webpack`
- `dev` currently maps to `webpack-dev-server --open`
- `index.html` is the HTML entry file for the Webpack setup
- `webpack.config.js` is the active production and development build configuration
- `tsconfig.json` is configured for the older Webpack-era toolchain and includes `assets`

## Storybook Status
- Story files exist under `stories/`
- `package.json` does not define a Storybook script
- `package.json` does not include Storybook packages
- No Storybook config file was found in the repository root or `.netlify`
- Status: abandoned tooling, not active baseline infrastructure
- Recommendation for Phase 1: defer removal until the active reusable component plan is clearer, or remove only if later phases confirm no retained use

## Dependency Findings
### Required Production Dependencies
- `react`, `react-dom`, `react-redux`, `redux`, `redux-thunk`, `axios`, `semantic-ui-react`, `styled-components`, `react-router-dom`, `react-animated-css`, `redux-devtools-extension`

### Required Development Dependencies
- `typescript`, `webpack`, `webpack-cli`, `webpack-dev-server`, `ts-loader`, `babel-loader`-style tooling via Babel packages, `css-loader`, `sass-loader`, `mini-css-extract-plugin`, `html-webpack-plugin`, `eslint` toolchain, `prettier`

### Potentially Unused or Overlapping Dependencies
- `moment`, `js-md5`, `uid2`, `react-scripts`, `tsdx`, `swc-loader`, `file-loader`, `style-loader`, `path`
- Several dependencies appear to exist only for legacy tutorial-era build paths

### Styling and Animation Dependencies
- `styled-components`, `@emotion/core`, `@emotion/styled`, `styled-system`, `semantic-ui-react`, `react-animated-css`, `sass`, `normalize.css`

### Testing Dependencies
- No current test runner or browser-testing stack was found in `package.json`
- `@types/jest` exists, but there is no matching active test command

### Compatibility Review Needed
- The manifest contains many older packages with peer-dependency warnings under the current Node/npm pair
- `npm ci` emitted numerous peer-resolution warnings before failing on the registry fetch

## Security Findings
- A local `.env` file was present during baseline inspection
- No secret values are reproduced in this report
- Manual credential revocation or regeneration is required outside the repository before any cleanup can be considered complete

## Dead-Code Candidates
- `assets/src/Heros/Icons.tsx`
- `assets/src/Heros/Heros.tsx`
- `assets/src/Heros/index.ts`
- `assets/src/index.ts` export surface for `Heros`
- `assets/src/actions/PokemonTypes.ts` stale field names such as `PokemonCharacter*` and `PokemonMoves`
- `assets/src/SearchBar/SearchBar.tsx` contains multiple legacy styling and animation dependencies

## Accessibility Findings
- The deployed page shows a visible search textbox and button, but the submit control is positioned in a way that is easy to intercept by the footer during pointer interaction
- The search component does not use a real `<form>`, so Enter-key submission is not guaranteed by the current implementation
- The live browser snapshot showed console warnings from `react-animated-css` and `createGlobalStyle` font imports
- The current footer links are implemented in a way that produces malformed relative URLs for external destinations in the deployed browser snapshot

## Testing Gaps
- No active unit, integration, or end-to-end test scripts are defined
- No MSW, Vitest, Playwright, or React Testing Library setup was found
- The live PokeAPI is used directly in the active thunk, so tests would currently need network isolation before they can be deterministic

## Documentation Gaps
- README still describes the project as using Nodemon and the legacy build flow
- README does not reflect the current branch safety, install failure, or the actual dependency state
- No architecture document exists yet for the current code path

## Deployment Observations
- The Netlify app loads under the expected public URL
- The page title is `John Fleurimond`
- The deployed app still reflects the legacy UI and animation stack
- Browser console warnings were observed on load:
  - `@import` usage inside `createGlobalStyle`
  - deprecated `componentWillReceiveProps` warning from `Animated`

## Known Blockers
- `npm ci` fails against the npm registry with HTTP `403`, so the current dependency state is not reproducible from this environment
- The existing local dev command cannot be validated because `webpack-dev-server` was unavailable when the script was invoked
- Browser-based validation of the local app is blocked until installation works again

## Recommended Phase 1 Scope
- Remove exposed credentials and any environment file from the working tree
- Clean stale naming in the Pokémon action and reducer types
- Preserve the Pokémon search behavior while preparing for a later build-tool migration

## Baseline Measurements
- Build duration: not measured because the install step failed
- Production bundle names: not measured
- CSS bundle names: not measured
- Network request count for one search: not measured in this baseline
- Duplicate requests: not measured
- Lighthouse performance: not measured
- Lighthouse accessibility: not measured
- Console warnings: at least two on the deployed app load
- Console errors: none captured from the deployed app load
