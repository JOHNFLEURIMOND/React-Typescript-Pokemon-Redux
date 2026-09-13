# Task Handoff

## Outcome

Implemented the application portion of the consent-gated GA4/GTM recovery and
documented the verified provider state in `ANALYTICS.md`. The app now emits
structured, privacy-bounded page-view, search, selection, detail-view, and API
error events after consent. No GTM or GA4 configuration was changed.

## Changes

- Replaced gtag arguments-array page views with structured `dataLayer` events.
- Added navigation-key deduplication and query-only navigation tracking.
- Removed query strings, fragments, and user-controlled Pokemon route segments
  from application page-view URLs.
- Added bounded shared context, query-length buckets, error categories, stable
  Pokemon IDs, and catalog list positions.
- Added focused adapter and interaction coverage.
- Updated `ANALYTICS.md` with container, destination, schema, privacy, duplicate,
  and release-gate evidence.

## Verification

- Ran `npm run ci`: passed with TypeScript, 13 test files and 70 tests, Vite
  production build, and repository formatting checks.
- Ran `npx prettier --check ANALYTICS.md`: passed.
- Browser-tested the production build at `http://127.0.0.1:4173/`.
- Before consent, confirmed no `dataLayer`, GTM script, or Google Analytics
  script was present.
- After consent, confirmed `GTM-TWGDBWJQ`, structured application events, one
  application page view per tested navigation, and no raw search text in the
  application data-layer payload.
- Observed requests to GA4 destination `G-GWD4BQMFEC`; the browser environment
  aborted them, so successful provider delivery was not proven.
- Observed the Google tag emit an additional automatic history page view with
  the raw browser URL. Production duplicate and privacy validation therefore
  fails until provider configuration is corrected.

## Git and deployment state

- Branch: `fix/ga4-gtm-recovery`.
- Application and documentation changes are local and uncommitted at this
  handoff update.
- No GTM publication, GA4 setting change, deployment, pull request, or merge has
  been performed for this recovery branch yet.

## Next actions

1. In GA4 Enhanced Measurement, disable page changes based on browser history
   events so the application remains the sole page-view owner.
2. Add and publish GTM custom-event triggers and GA4 event tags for
   `pokemon_search`, `pokemon_select`, `pokemon_detail_view`, and
   `pokemon_api_error`.
3. Re-run consent, network, GTM Preview, DebugView, Realtime, and property-mapping
   validation before deploying or claiming recovery complete.

## Workflow Documentation Update (2026-09-13)

- Added the shared `GIT_WORKFLOW.md` repository workflow guide.
- Added `.cache_ggshield` to `.gitignore` for GitGuardian's local cache.
- Verified the workflow file matches the versions added to the Earthquake and
  BlackInventors repositories by SHA-1 checksum.
- Ran `npx prettier --write GIT_WORKFLOW.md`, then
  `npx prettier --check GIT_WORKFLOW.md`: passed.
- No application tests were run because these updates affect documentation and
  an ignored local-tool cache only.
- Branch remains `docs/analytics-repository-audit`; no pull request, merge, or
  deployment was performed.
