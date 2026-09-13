# Analytics Measurement Specification

## Status and objectives

This document is the analytics contract and recovery record for
React-Typescript-Pokemon-Redux. The application implements consent-gated,
vendor-neutral data-layer events for page views, searches, catalog selections,
detail views, and user-visible API failures. Filter and outbound-link events in
the contract remain unimplemented.

The objectives are to measure whether visitors can discover Pokemon, move
between the Pokemon and trading-card catalogs, open a Pokemon detail page, and
recover from API failures. The event set intentionally excludes generic clicks,
scrolling, Redux state changes, automatic API-success events, favorites, and
teams. Favorites and teams do not exist in the current application.

## Current implementation and recovery diagnosis

- The application loads `GTM-TWGDBWJQ` only after analytics consent and keeps
  advertising storage, advertising user data, advertising personalization,
  Google signals, and ad-personalization signals disabled.
- Application events use structured objects such as
  `{ event: "page_view", ...parameters }`. Consent Mode commands retain the
  gtag arguments-array format required by GTM.
- The published container response was inspected on 2026-09-13. It configures
  GA4 Measurement ID `G-GWD4BQMFEC`, sets `send_page_view` to `false`, and has a
  custom-event trigger for `page_view`. The application has one page-view owner,
  but browser validation found that the Google tag still emits an additional
  automatic history page view.
- The published container does not contain triggers for `pokemon_search`,
  `pokemon_select`, `pokemon_detail_view`, or `pokemon_api_error`. Those events
  enter the data layer after consent but will not reach GA4 until matching GA4
  event tags and custom-event triggers are configured and published in GTM.
- Router navigation keys provide page-view deduplication. Query-only navigation
  produces a page view while `page_location` and `page_path` omit query strings
  and fragments. User-controlled `/pokemon/:nameOrId` segments are normalized to
  the route template before entering the data layer.
- All implemented events include `app_name`, `page_type`, and `environment`.
  Search text and raw errors are replaced with bounded categories.
- Tealium is not used. There is no direct `gtag.js` or second GTM container.

The earliest confirmed application failure was the gtag arguments-array shape
used for `page_view`; the published GTM custom-event trigger expected a
structured event object. That failure is corrected in source. Production
deployment, outbound GA4 requests, DebugView, Realtime, and standard reports
still require runtime validation.

## Repository audit evidence

Audit date: 2026-09-13. The active repository and the separate
`fix/remove-direct-ga4-test-id` worktree were inspected. Generated output and
dependency directories were excluded. A source search for `gtag`, `dataLayer`,
GTM/GA4 identifiers, Tealium, analytics calls, favorites, and team features was
also performed.

| Area                             | Source evidence                                                                                                                                                                                                                                                      | Finding                                                                                                                                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework and entry point        | [package.json](package.json#L27-L55), [src/main.tsx](src/main.tsx#L1-L24)                                                                                                                                                                                            | React 18, TypeScript, Vite, Redux Toolkit/RTK Query, and React Router v5 render under `StrictMode` and `BrowserRouter`.                                                                                                                 |
| Active routes and external links | [src/App.tsx](src/App.tsx#L1-L88)                                                                                                                                                                                                                                    | The active screens are `/`, `/cards`, and `/pokemon/:nameOrId`. The footer links to PokeAPI and Pokemon TCG API. There is no privacy route in the active branch.                                                                        |
| Consent implementation           | [src/lib/analyticsConsent.ts](src/lib/analyticsConsent.ts#L1-L77), [src/components/privacy/CookieConsentBanner.tsx](src/components/privacy/CookieConsentBanner.tsx#L1-L133)                                                                                          | Consent accepts only `granted` or `denied`, fails closed for missing or inaccessible storage, dispatches `analytics-consent-change`, and removes readable GA cookies on denial. The banner states that analytics is not connected.      |
| Active collection path           | [src/App.tsx](src/App.tsx#L61-L88), [index.html](index.html#L1-L19)                                                                                                                                                                                                  | The app renders the consent banner and routes, but imports no analytics loader. The HTML has no static analytics tag. Repository search found no active `gtag`, GTM, GA4 Measurement ID, Tealium, page-view call, or interaction event. |
| Worktree-only collection         | [worktree App.tsx](../../Worktrees/React-Typescript-Pokemon-Redux/fix-remove-direct-ga4-test-id/src/App.tsx#L67-L78), [worktree googleAnalytics.ts](../../Worktrees/React-Typescript-Pokemon-Redux/fix-remove-direct-ga4-test-id/src/lib/googleAnalytics.ts#L1-L138) | The separate worktree observes pathname changes, waits for consent, injects one hard-coded GTM container, and pushes `page_view`. It does not contain a direct GA4 Measurement ID or business-event adapter.                            |
| Search and scope                 | [src/components/explorer/ExplorerSearch.tsx](src/components/explorer/ExplorerSearch.tsx#L1-L66), [src/pages/PokemonCatalogPage.tsx](src/pages/PokemonCatalogPage.tsx#L86-L111), [src/pages/PokemonTcgCatalogPage.tsx](src/pages/PokemonTcgCatalogPage.tsx#L101-L121) | Search is submitted deliberately and supports Pokemon or trading-card scope. The TCG query is stored in the URL. No search or scope analytics call exists.                                                                              |
| Pagination                       | [src/pages/PokemonCatalogPage.tsx](src/pages/PokemonCatalogPage.tsx#L76-L83), [src/pages/PokemonTcgCatalogPage.tsx](src/pages/PokemonTcgCatalogPage.tsx#L91-L98)                                                                                                     | Pagination changes query parameters. The worktree page-view effect watches pathname only, so query-only pagination and TCG searches are not page views.                                                                                 |
| Cards and detail                 | [src/components/explorer/PokemonPreviewCard.tsx](src/components/explorer/PokemonPreviewCard.tsx#L129-L165), [src/pages/PokemonDetailPage.tsx](src/pages/PokemonDetailPage.tsx#L18-L105)                                                                              | Pokemon cards expose quick-facts, shiny, and detail actions. Detail renders Pokemon data and related TCG cards. None has an analytics call.                                                                                             |
| API calls and failures           | [src/services/pokemonApi.ts](src/services/pokemonApi.ts#L27-L42), [src/services/pokemonTcgApi.ts](src/services/pokemonTcgApi.ts#L20-L31), [src/pages/PokemonTcgCatalogPage.tsx](src/pages/PokemonTcgCatalogPage.tsx#L40-L75)                                         | RTK Query calls PokeAPI and Pokemon TCG API. The TCG screen supports bounded retry behavior, but API outcomes and retries are not tracked.                                                                                              |
| Existing tests                   | [src/lib/analyticsConsent.test.ts](src/lib/analyticsConsent.test.ts#L1-L160), [worktree googleAnalytics.test.ts](../../Worktrees/React-Typescript-Pokemon-Redux/fix-remove-direct-ga4-test-id/src/lib/googleAnalytics.test.ts#L1-L81)                                | Active tests cover consent behavior. Worktree tests cover consent-gated GTM insertion, URL-query removal, and one data-layer page view; they do not validate an outbound GA4 request or DebugView.                                      |

### Audit findings

1. **Resolved - page-view collection shape:** the app now pushes a structured
   `page_view` object that matches the published GTM custom-event trigger.
2. **Resolved - route gap:** query-only router navigation is tracked once using
   the navigation key, with query strings removed from analytics URLs.
3. **High - GTM publication dependency:** interaction events need matching GA4
   event tags and custom-event triggers in the published container.
4. **High - automatic history tracking:** the published Google tag emits another
   page view from the raw browser URL on SPA navigation. This duplicates the
   application event and can expose a user-entered route segment. Disable page
   changes based on browser history events in Enhanced Measurement before
   release.
5. **Medium - remaining measurement gap:** filter, retry, and outbound-link
   events are specified but not implemented.
6. **Low - development contamination risk:** no source-level environment gate
   prevents a consenting local session from loading the production container.

Favorites and teams were not found in current source and remain excluded. This
record does not establish which revision is deployed or prove delivery to GA4.

## Consent and privacy

- Require an explicit `analytics_storage=granted` choice before loading GTM or
  sending, persisting, or replaying analytics events.
- Keep `ad_storage`, `ad_user_data`, and `ad_personalization` denied. Do not
  enable Google signals or ad personalization.
- A denied, unknown, malformed, or inaccessible consent state must fail closed.
- Consent revocation must stop future collection and remove readable GA cookies
  as the existing consent implementation requires.
- Never send raw search text, full URLs, query strings, fragments, API responses,
  request URLs, raw errors, IP addresses, or other personal or sensitive data.
- Use public Pokemon identifiers and bounded categories only. Do not derive a
  stable identifier for a visitor.
- Blocked events are not replayed after consent is granted.

## Naming and parameter rules

- Use lowercase snake_case event and parameter names.
- Components call a vendor-neutral application adapter. Only the adapter maps
  the contract to GTM or GA4.
- Use stable identifiers instead of display text. Send `pokemon_id` as a string.
- Integers must be finite whole numbers within the bounds documented below.
- Enum values must come from documented allowlists. Booleans must be true or
  false, not string equivalents.
- Omit unavailable optional values. Never send `undefined`, `null`, objects,
  arrays, or unrestricted error messages.
- Limit string values to 100 characters unless a smaller enum applies.
- Include the shared parameters `app_name`, `page_type`, and `environment` on
  every event through the adapter. Their values are `pokemon_redux`, a bounded
  page enum, and `production|development|test`.

## Event specification

| Event name             | Application                    | Trigger                                                                                                           | Required parameters                                                                | Optional parameters   | Parameter types                                                                                                                                                                            | Consent requirement        | Duplicate rule                                                                                                                        | GA4 conversion? | Validation method                                                                                         |
| ---------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| `page_view`            | React-Typescript-Pokemon-Redux | A resolved initial route or client-side route change to the catalog, Pokemon detail, TCG catalog, or privacy page | `app_name`, `page_type`, `page_path`, `environment`                                | `pokemon_id`          | Shared strings; `page_type`: `pokemon_catalog\|pokemon_detail\|tcg_catalog\|privacy\|not_found`; `page_path`: path-only string; `pokemon_id`: string                                       | Analytics consent required | One event per router navigation key; one owner only; do not also enable automatic GTM history page views                              | No              | Confirm one data-layer event and one GA4 request per route in GTM Preview, browser Network, and DebugView |
| `pokemon_search`       | React-Typescript-Pokemon-Redux | A deliberate search submission that changes or attempts to change the current result context                      | `app_name`, `page_type`, `environment`, `search_scope`, `query_length_bucket`      | `result_state`        | `search_scope`: `pokemon\|tcg`; `query_length_bucket`: `empty\|1_3\|4_10\|11_plus`; `result_state`: `submitted\|no_match`                                                                  | Analytics consent required | One event per form submission; do not emit on each keystroke or replay after consent                                                  | No              | Submit once, confirm no raw query in the data layer/request, and verify one DebugView event               |
| `pokemon_filter_apply` | React-Typescript-Pokemon-Redux | The user changes the catalog search scope                                                                         | `app_name`, `page_type`, `environment`, `filter_name`, `filter_value`              | `previous_value`      | `filter_name`: `search_scope`; values: `pokemon\|tcg`                                                                                                                                      | Analytics consent required | Emit only when the normalized value changes; do not also emit `pokemon_search` until a search is submitted                            | No              | Change scope once and verify one request with allowlisted values                                          |
| `pokemon_select`       | React-Typescript-Pokemon-Redux | The user deliberately opens a Pokemon detail page from a rendered Pokemon card                                    | `app_name`, `page_type`, `environment`, `pokemon_id`, `list_position`              | `source`              | `pokemon_id`: string; `list_position`: integer `1..200`; `source`: `pokemon_catalog`                                                                                                       | Analytics consent required | One event per activated card; keyboard and pointer handling must share one tracking path                                              | No              | Activate one card by pointer and keyboard separately; each action must produce exactly one request        |
| `pokemon_detail_view`  | React-Typescript-Pokemon-Redux | A Pokemon detail response is successfully rendered for the first time on a route                                  | `app_name`, `page_type`, `environment`, `pokemon_id`                               | `pokemon_type`        | `pokemon_id`: string; `pokemon_type`: bounded API type name, lowercase string                                                                                                              | Analytics consent required | Once per Pokemon ID and router navigation key; do not emit from render retries or StrictMode effects                                  | No              | Open one detail route and verify one event after content renders, distinct from `page_view`               |
| `pokemon_api_error`    | React-Typescript-Pokemon-Redux | A PokeAPI or Pokemon TCG request reaches a user-visible failure state                                             | `app_name`, `page_type`, `environment`, `api_name`, `error_type`, `request_status` | `operation`           | `api_name`: `pokeapi\|pokemon_tcg`; `error_type`: `network\|timeout\|rate_limited\|not_found\|server\|unknown`; `request_status`: integer `0..599`; `operation`: `catalog\|detail\|search` | Analytics consent required | Once per failed request lifecycle; rerendering the same error does not emit again; a deliberate retry may produce a new failure event | No              | Force one bounded failure, confirm no URL/query/error body in the payload, and verify one request         |
| `outbound_click`       | React-Typescript-Pokemon-Redux | The user activates an allowlisted external footer or privacy link                                                 | `app_name`, `page_type`, `environment`, `link_id`, `link_domain`                   | `navigation_location` | All values are bounded strings; `navigation_location`: `footer\|privacy`                                                                                                                   | Analytics consent required | One event per deliberate activation; do not combine DOM-trigger and application tracking                                              | No              | Activate an allowlisted link and preserve the event during navigation; verify one request                 |

## Expected frequency

- `page_view`: once per resolved initial load or client-side route navigation.
- `pokemon_search`: zero or more times per session, once per deliberate submit.
- `pokemon_filter_apply`: zero or more times per session, once per changed scope.
- `pokemon_select`: zero or more times per session, once per selected card.
- `pokemon_detail_view`: at most once per detail navigation.
- `pokemon_api_error`: exceptional and no more than once per failed request.
- `outbound_click`: zero or more times per session, once per external activation.

Unexpected bursts, identical consecutive payloads, or two page views for one
navigation are duplicate-tracking signals.

## GA4 custom dimensions

Register only dimensions needed for reporting:

- Shared: `app_name`, `page_type`, `environment`, `navigation_location`,
  `filter_name`, `filter_value`, `api_name`, `error_type`.
- App-specific: `pokemon_type`, `search_scope`.

Keep `pokemon_id`, `page_path`, `list_position`, `request_status`, and
`query_length_bucket` as event parameters unless a defined report requires a
custom dimension. Reassess cardinality before registration.

## Conversion policy

Do not mark any event in this initial specification as a GA4 conversion. The app
has no verified business-completion action. Page views, searches, selections,
detail views, API errors, and outbound links are diagnostic or engagement events.

## Validation and release gates

1. Confirm the production deployment contains the intended analytics adapter and
   consent-gated loader.
2. Confirm the deployed GTM container ID and published GA4 tag. Record the GA4
   Measurement ID in the deployment inventory without committing it as a test
   constant.
3. With consent denied and unknown, verify that GTM does not load and no GA4
   request is sent.
4. With consent granted, inspect `dataLayer` and GTM Preview for the exact event,
   parameter names, types, and trigger count.
5. In browser Network, verify one request to the expected GA4 destination and
   confirm the payload contains no query text, full URL, or raw error data.
6. Verify the same event once in GA4 DebugView, then confirm it reaches the
   intended production property and later standard reporting.
7. Test initial load, SPA navigation, query-only search/pagination behavior,
   repeated clicks, API failure and retry, external navigation, consent grant,
   denial, and revocation on desktop and mobile.
8. Ensure development and test traffic are excluded or routed separately before
   production collection is enabled.

A console log, data-layer push, or GTM tag firing alone is not a passing result.

## Known gaps, assumptions, and risks

- The published container identifies `G-GWD4BQMFEC`, but its mapping to GA4
  property `properties/553377307` could not be verified because provider API
  authorization was expired or revoked.
- Browser validation observed consented requests to `G-GWD4BQMFEC`. Requests
  were aborted by the browser environment, so delivery to GA4 was not proven.
- The application emitted one structured page view for the tested navigation.
  The Google tag also emitted an automatic history page view with the raw URL.
- The current published container handles `page_view` only. Interaction events
  require GTM tags and triggers before they can reach GA4.
- The adapter marks analytics configured when script insertion starts and has no
  script-load failure recovery.
- Static document titles may make page titles stale unless route titles are set.
- Ad blockers and browser privacy controls can suppress otherwise valid requests.
- Pagination is an existing interaction but is excluded from the initial event
  set until a reporting question justifies a dedicated event.
- Production deployment, GTM Preview, GA4 DebugView, Realtime, and reporting
  remain unverified.
