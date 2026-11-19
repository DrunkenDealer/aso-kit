# Changelog

## 1.0.0 — 2026-11-19

- First public release, installed as `aso-kit@mashlab` from the `mashlab` catalog in
  [claude-plugins](https://github.com/DrunkenDealer/claude-plugins). Replaces the older ASO skill chain.
- Text only: screenshot planning, rating-prompt strategy and A/B planning are gone. Screenshots get an optional
  brief that [Vitrine Deck](https://github.com/DrunkenDealer/claude-code-vitrine-deck) builds from.
- A knowledge base of App Store and Google Play facts as of 2026-11-19, every one sourced and dated, linted by
  `drift.mjs` and re-verified by `/aso-refresh`.
- `check.mjs` grades copy against store limits, banned words per store and language, keyword-field rules and
  description density; `store.mjs` reads autocomplete, search, listings and charts from both stores.
