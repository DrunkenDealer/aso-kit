---
name: aso-keywords
description: Builds a scored keyword set for one locale on the App Store and Google Play — seeds from the app, live autocomplete from both stores, competitor title and subtitle patterns, relevance-gated opportunity scores, and the packed iOS 100-byte keyword field. Triggers on "keyword research", "ASO keywords", "find keywords for my app", "fill my App Store keyword field".
user-invocable: true
argument-hint: "[locale, default the primary one]"
allowed-tools: Read, Write, Glob, Grep, Bash, WebFetch, AskUserQuestion
---

# ASO keywords

Writes `aso/keywords-<locale>.md`. Method: `../aso/knowledge/keyword-method.md` — follow it, don't restate it. Field rules: `../aso/knowledge/ios-metadata.md` § Keyword field rules. Paths, gates, console: `../aso/references/conventions.md`. Bare knowledge file names (`copy.md`, `limits.json`…) are in `../aso/knowledge/`.

Needs `aso/context.md`. Without it, read the repo for name, positioning and competitors, and say the context step was skipped.

## 1. Seed

10–30 terms **in the locale's language**, from the sources in `keyword-method.md` § 1. Never translate English seeds into another locale — write them in that language from its own vocabulary.

## 2. Expand

Derive `--cc` and `--lang` from the locale first. Then:

```
node ../aso/scripts/store.mjs suggest ios "<seed>" --cc <cc>
node ../aso/scripts/store.mjs suggest play "<seed>" --cc <cc> --lang <lang>
```

Each seed, then seed + space, then the seeds that return 10 suggestions with each of a–z only if the list is still thin. Suggestions that are app names (`brand: …`) are competitor signals, not keywords.

**Competitors.** For each one in context, plus the top 5 of `store.mjs search <store> "<head term>"`: `store.mjs lookup` and note:

1. Title shape — `Brand: Phrase`, `Phrase - Brand`, brand only.
2. The keyword phrase in the title and subtitle / short description.
3. The words every competitor uses (table stakes) and the jobs nobody's title names (white space).

## 3. Score

Relevance gate, then volume, difficulty and relevance 1–3 each, opportunity = relevance × (volume + 4 − difficulty), per `keyword-method.md` § 3. Volume on iOS: Apple Ads popularity if the developer pastes it, otherwise suggest rank and how many seeds surface the term. Difficulty: ratings count and exact-match titles in `store.mjs search`. Keep 15–20 targets and a reserve of similar size. Say which inputs were proxies.

## 4. Place and pack

Cluster and place per `keyword-method.md` § 4: head term → name / title, second cluster → subtitle / short description, everything else → the iOS keyword field and the Play full description.

**Pack the iOS keyword field once, here.** Single words, comma-separated, no spaces, none of the words planned for the name or subtitle, no plural of a word already in, no banned word from `limits.json`, filled to ≥ 90 of 100 characters:

```
node -e 'console.log([...process.argv[1]].length)' "<field>"
```

## 5. Write `aso/keywords-<locale>.md`

```markdown
> aso-keywords · <locale> · YYYY-MM-DD

# Keywords — <locale>

**Head term:** <term> · **Volume source:** <Apple Ads popularity | autocomplete proxy>

## Targets
| Term | Vol | Diff | Rel | Opp | iOS | Play | Source |
| habit tracker | 3 | 3 | 3 | 12 | name | title | suggest, 4/5 competitors |

## Placement
- **iOS name:** <head phrase> · **subtitle:** <second cluster>
- **Play title:** <head phrase> · **short description:** <1–2 terms>
- **Play full description:** <cluster terms for the first three sentences and bullets>

## iOS keyword field (<n>/100 chars)
`streak,reminder,journal,...`

## Competitors
| App | Title shape | Phrase they own |
**Table stakes:** … · **White space:** …

## Reserve
<terms to swap in when one fails check.mjs or a native reviewer>
```

Then grade it:

```
node ../aso/scripts/check.mjs aso/keywords-<locale>.md
```

Fix every `✗` and run again until exit 0: a target without a source, a competitor name, a field word already planned for the name or subtitle. Update the state line `Keywords`.

## Console

```
aso-keywords · <locale> · <n> targets · head "<term>" · field <n>/100 chars
→ aso/keywords-<locale>.md
```

## Rules

1. Competitor app names never become targets — they're for paid conquesting only.
2. No volume number is invented. A proxy is labelled a proxy.
3. A tool threshold ("popularity > 25") doesn't transfer between tools; don't quote one (`myths.md`).
