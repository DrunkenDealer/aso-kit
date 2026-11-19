# ASO Kit: App Store and Google Play text ASO for Claude Code

**ASO Kit is a Claude Code plugin for the text side of App Store Optimization.** It reads your app's repo and the
live stores, researches keywords per market, writes the title, subtitle, keyword field and descriptions for both
stores, and grades every field against store limits and policy before you paste it.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757)

Every store fact it reasons from is sourced and dated — official docs first, practitioner opinion labelled as
such, contested claims marked **Disputed** — so you can see why it says what it says, and re-check it when the
stores change.

## Install

```
/plugin marketplace add DrunkenDealer/claude-plugins
/plugin install aso-kit@mashlab
```

Then open your app's repo and ask **"Where do I start with ASO?"** (or `/aso-kit:aso`).

## Skills

| Skill | Does | Writes |
|---|---|---|
| `aso` | walks the steps below with a question between each | nothing |
| `aso-context` | app, audience, main feature, screens, markets, peer competitors, live listing and rating | `aso/context.md` |
| `aso-keywords` | seeds, live autocomplete from both stores, competitor patterns, scored targets, the packed iOS keyword field | `aso/keywords-<locale>.md` |
| `aso-metadata` | every text field for both stores, graded until clean; optional screenshot brief | `aso/metadata.json`, `aso/metadata-<locale>.md`, `aso/screenshot-brief.md` |
| `aso-audit` | text-only audit of a live listing or a draft, fixes by when they can ship, how to measure | `aso/audit.md` |
| `aso-localize` | a new market with native keyword research, App Store cross-localization, native review gate | per-locale files |
| `aso-refresh` | re-checks the knowledge base against the stores' docs and live probes | patches with new dates |

Output lives in one `aso/` folder in your repo. Nothing touches `fastlane/metadata/` unless you say yes.

## Screenshots

Out of scope on purpose. `aso-metadata` can write `aso/screenshot-brief.md` — the main feature, the screens worth
showing, and the headline for each slide — and hand it to
[Vitrine Deck](https://github.com/DrunkenDealer/claude-code-vitrine-deck), which builds the screenshots from it.
The brief works for any designer too.

## Under the hood

- [`knowledge/`](plugin/skills/aso/knowledge) — field limits, indexing, ranking, policy, keyword method, copy,
  localization, store endpoints, myths, a changelog of store changes. Verified 2026-11-19.
- [`scripts/check.mjs`](plugin/skills/aso/scripts/check.mjs) — grades a `metadata.json` for limits (keyword field in
  characters), unfilled indexed space, banned words per store and language, competitor names, keyword-field waste, Play
  title rules, description density, and events, IAPs, product pages, tags and promo content; grades a keyword plan
  for sources and packing; checks line budgets. `node check.mjs aso/metadata.json`
- [`agents/aso-verifier`](plugin/agents/aso-verifier.md) — a second reader on Haiku: grades the copy against a
  [rubric](plugin/skills/aso/references/rubric.md) (plan applied, true claims, native language, policy tone) with a
  quote per verdict, after the checker passes. For a second language it back-translates the key lines and checks
  they promise what the English does.
- [`scripts/store.mjs`](plugin/skills/aso/scripts/store.mjs) — autocomplete, search, lookup and charts from both
  stores' public endpoints. `node store.mjs probe` checks they still work.
- [`scripts/drift.mjs`](plugin/skills/aso/scripts/drift.mjs) — fails when a fact lacks a source or a date, is older
  than 180 days, or the limits disagree.

No API keys, no paid tools. Network calls go only to `itunes.apple.com`, `apps.apple.com`, `search.itunes.apple.com`
and `play.google.com`, carrying the search terms and app ids you research. `/aso-refresh` also fetches the documentation pages the knowledge base cites.

## Requirements

Claude Code and Node.js 18+.

## Development

```sh
node --test evals/check.test.mjs          # checker against good and bad fixtures
node plugin/skills/aso/scripts/drift.mjs  # knowledge-base lint
claude plugin eval plugin                 # trigger evals
```
