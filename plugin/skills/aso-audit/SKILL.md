---
name: aso-audit
description: Audits the text of a live App Store or Google Play listing — or a draft in aso/metadata.json — against store limits, policy and keyword placement, checks the rating gate, and returns prioritised fixes plus how to measure them (before/after on iOS, store listing experiments on Play). Text only; screenshots and icons are out of scope. Triggers on "audit my app listing", "ASO audit", "what's wrong with my App Store page", "review my Play Store listing".
user-invocable: true
argument-hint: "[app store id | package name | draft]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# ASO audit

Writes `aso/audit.md`. Paths, gates, console: `../aso/references/conventions.md`. Bare knowledge file names (`copy.md`, `limits.json`…) are in `../aso/knowledge/`.

## 1. What to audit

- `$ARGUMENTS` is `draft`, or there is no live listing → `aso/metadata.json`.
- Otherwise the live listing, per store and locale in `aso/context.md` (primary if no context):

  ```
  node ../aso/scripts/store.mjs lookup ios <id> --cc <cc> > aso/snapshots/ios-<cc>.json
  node ../aso/scripts/store.mjs lookup play <package> --cc <cc> --lang <lang> > aso/snapshots/play-<cc>.json
  ```

  Map the snapshot into the `metadata.json` schema in `aso/snapshots/live.json` — `name`, `subtitle`, `description`, `whatsNew`; `title`, `shortDescription`, `fullDescription`, `releaseNotes` ← `whatsNew`. The keyword field and promotional text aren't public: take them from `fastlane/metadata/` if present, otherwise mark them unaudited.

## 2. Grade

```
node ../aso/scripts/check.mjs aso/snapshots/live.json --json
```

Then judge what the checker can't, field by field, against `copy.md` and `keyword-method.md`:

| Check | Pass when |
|---|---|
| Name / title | brand plus one head phrase; under 30 but not wasting more than ~8 chars |
| iOS subtitle | new keywords, no name words, value readable in ~26 chars |
| iOS keyword field | ≥ 90 characters, single words, no repeats of name or subtitle |
| Play short description | a benefit with 1–2 targets, not the full description's opening |
| Description | positioning sentence first; Play: head term in the first three sentences, 3–5 times total |
| Targets | if `aso/keywords-<locale>.md` exists: each top-5 target sits in an indexed field |
| What's New | specific, not generic (iOS 2.3.12 allows generic only for bug-fix releases) |
| Rating | ≥ 4.0 per store (`ranking.md`) |

Score each row ✓ / ! / ✗. No 0–100 total — a weighted score implies field weights neither store publishes.

## 3. Write `aso/audit.md`

```markdown
> aso-audit · <locale> · YYYY-MM-DD · <live | draft>

# Audit — <App>

**Rating:** iOS 4.7 · Play 3.9 ✗ — below 4.0, ratings first
**Checker:** <n> errors, <n> warnings

## Scorecard
| Field | iOS | Play | Note |

## Fixes
### Now (no release needed)
<iOS promotional text, Play listing fields, policy errors>
### Next release
<iOS version-bound fields>
### Next cycle
<keyword research, localization>

## Measure
- **iOS:** one text change per release, equal before/after windows, ~4 weeks to settle. PPO doesn't test text (`ios-metadata.md`).
- **Play:** a store listing experiment on the short or full description — up to 2 variants + control (`play-metadata.md`).
```

Each fix names the field, the problem, and the replacement or the skill that writes it (`/aso-metadata`).

Then `aso/changelog.md`, if it exists:

- A `ready` row whose copy matches the live listing → set it `live` with the date the developer gives (ask once; today if unknown).
- A `live` row past its window (iOS ~4 weeks, Play 6–8 weeks) with an empty Result → fill it: head-term rank before → now from `store.mjs search`, conversion if the developer has it.
- `node ../aso/scripts/check.mjs aso/` reporting a locale `stale` → a **Next cycle** fix: "update <locale> from the current <primary> with `/aso-localize <locale>`". Never rewrite it here.

Update the state line `Audit`.

## Console

```
aso-audit · <locale> · <n> ✗ <n> ! · <the worst finding in a few words>
→ aso/audit.md
```
