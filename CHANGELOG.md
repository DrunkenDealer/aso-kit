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
- `aso-verifier`, a read-only Haiku agent, grades copy against a rubric after the checker passes; for a second
  language it back-translates the key lines and checks they promise what the English does.
- English only by default. `aso-localize` is a separate, later step — one locale at a time, built from a live and
  measured English listing, gated on `aso/changelog.md`.
- `aso/changelog.md` records every copy change per locale and its result; `aso/releases.md` records every release.
- `aso-release` writes What's New and Play release notes from the commits since the last release, for every live
  locale, and says whether the listing needs attention.
