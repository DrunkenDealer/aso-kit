# Conventions

Shared by every aso-kit skill. Nothing here describes an order — that is `/aso`'s business.

Paths are relative to the `aso` skill folder; from any other skill, prefix `../aso/`.

## Output

One folder, `aso/`, at the project root. No dates in file names; each file opens with its own date line. Re-running a skill overwrites its file — git keeps the history. The exception is `aso/changelog.md`: append-only, the record of what shipped where and how it did.

| File | Written by | Holds |
|---|---|---|
| `aso/context.md` | `/aso-context` | app, positioning, audience, main feature, screens, markets, competitors, rating, the state block |
| `aso/snapshots/<store>-<cc>.json` | any skill that fetches a listing | `store.mjs lookup` output, verbatim |
| `aso/keywords-<locale>.md` | `/aso-keywords` | scored targets, clusters, competitor patterns, the packed iOS keyword field |
| `aso/metadata.json` | `/aso-metadata`, `/aso-localize` | every field, every locale — the file `check.mjs` grades |
| `aso/metadata-<locale>.md` | `/aso-metadata`, `/aso-localize` | paste-ready fields with lengths, the release plan |
| `aso/screenshot-brief.md` | `/aso-metadata`, on request | the slide brief — format in `screenshot-brief.md` |
| `aso/audit.md` | `/aso-audit` | scorecard, findings, measurement plan |
| `aso/changelog.md` | `/aso-metadata` appends, `/aso-audit` updates status and result | one row per copy change per locale — the source `/aso-localize` gates on |

Line budgets — short is the point; `node ../aso/scripts/check.mjs aso/` flags a file over its budget:

| File | Lines |
|---|---|
| `context.md`, `audit.md`, `screenshot-brief.md` | 50 |
| `keywords-<locale>.md` | 40 |
| `metadata-<locale>.md` | 60 |

First line of every md file:

```
> <skill> · <locale or "all"> · YYYY-MM-DD
```

## Scripts

All read-only except where noted; all need Node ≥ 18.

| Script | Use |
|---|---|
| `scripts/store.mjs` | `suggest`, `search`, `lookup`, `top` for both stores; `probe` checks every call |
| `scripts/check.mjs <metadata.json \| keywords-<locale>.md>` | grades fields, or a keyword plan, against `knowledge/limits.json`. Exit 1 = errors. Never ship with errors |
| `scripts/store.mjs match` | whether a store folds two spellings into one word |
| `scripts/drift.mjs` | lints the knowledge base (`/aso-refresh`) |

## Locale and storefront

Copy is keyed by **locale** (`en-US`, `de-DE`, `pt-BR`); store calls by **storefront** (`--cc us`) and, on Play, **language** (`--lang de`). Derive both from the locale before any network call: `en-US → us/en`, `en-GB → gb/en`, `de-DE → de/de`, `pt-BR → br/pt`, `es-MX → mx/es`, `ja → jp/ja`, `ko → kr/ko`, `zh-Hans → cn/zh`, `zh-Hant → tw/zh`. A locale with no country (`fr`) takes its main market (`fr`).

## metadata.json

```json
{
  "app": "Habitly", "brand": "Habitly", "developer": "Northwind Labs",
  "competitors": ["Streaks", "Habitify"],
  "locales": {
    "en-US": {
      "primaryKeyword": "habit tracker",
      "ios":  { "name": "", "subtitle": "", "keywords": "", "promotionalText": "", "description": "", "whatsNew": "" },
      "play": { "title": "", "shortDescription": "", "fullDescription": "", "releaseNotes": "" }
    }
  }
}
```

Optional lists, graded item by item when present: `ios.events` `[{name, short, long}]`, `ios.iaps` `[{name, description}]`, `ios.customProductPages` `[{promotionalText}]`, `play.tags` `["…"]`, `play.promotionalContent` `[{title, description}]`.

A store the app isn't on is omitted. A field left out is not graded. Name, subtitle, Play title and short description warn below 90% of their limit: indexed space left empty is ranking left unclaimed. `competitors` are the names `check.mjs` must never see in the copy.

## Changelog

```markdown
> aso changelog · all

| Date | Locale | Stores | Fields | Change | Built on | Status | Result |
|---|---|---|---|---|---|---|---|
| 2026-11-19 | en-US | ios, play | name, subtitle, keywords | first keyword-targeted copy | — | live 2026-11-21 | 2026-12-19: "habit tracker" 48 → 21 |
| 2027-01-05 | de-DE | ios, play | all | new locale | en-US 2026-11-19 | ready | — |
```

- **Date** — when the copy was written. **Built on** — for a non-primary locale, the primary's row date it was written from; `—` for the primary.
- **Status** — `ready` (written, not in the store), `live YYYY-MM-DD`, or `dropped`. The developer or `/aso-audit` sets `live`.
- **Result** — filled once the window has passed: iOS ~4 weeks, Play 6–8 weeks after `live` (`knowledge/ranking.md`). Rank of the head term before → after, conversion if known.
- The primary locale is `en-US` unless the app has no English listing; it is the first locale in the file.

`check.mjs aso/` checks the table: eight cells, ISO dates, a valid status.

## State block

The end of `aso/context.md`. `/aso-context` writes every line as `—`.

```
## ASO state
- Context: YYYY-MM-DD
- Keywords: —
- Metadata: —
- Screenshot brief: —
- Audit: —
- Localized: —
```

Value: a date, optionally with locales (`2026-11-19 (en-US, de-DE)`). A skill writes only its own line, on success. No `aso/context.md` → skip the write, don't create the file.

## Console

A skill prints exactly this; the detail lives in the file.

```
<skill> · <locale> · <headline>
→ <path>
```

The headline is the single most decision-relevant fact — a count, a score, a blocker. Skills that write copy add the fill of each indexed field (`name 28/30`), since unused indexed space is the most common waste. Run standalone, a skill may add one line naming what naturally follows.

## Gates

1. **Rating.** Below 4.0 on either store, say so first: ratings outrank keyword work (`knowledge/ranking.md`). Continue if the developer wants to.
2. **Questions.** Read the repo before asking. Ask at most once per skill run, one `AskUserQuestion` round, at most three questions, each with a recommended default.
3. **Writing outside `aso/`.** `fastlane/metadata/` or any store file in the repo changes only after the developer says yes.
4. **Facts.** A store fact comes from `knowledge/`, cited by file. A claim that is only practitioner-backed is phrased "practitioners report", never as a rule.
