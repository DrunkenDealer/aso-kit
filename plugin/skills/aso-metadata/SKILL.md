---
name: aso-metadata
description: Writes the App Store and Google Play text for one locale — app name, subtitle, keyword field, promotional text, description, What's New; Play title, short and full description, release notes — from a scored keyword set, graded by a checker against store limits and policy until it passes. Optionally writes a screenshot brief for /vitrine-deck. Triggers on "write my app store description", "optimize my title and subtitle", "store listing copy", "ASO metadata", "short description for Google Play".
user-invocable: true
argument-hint: "[locale, default the primary one]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Skill, Agent, AskUserQuestion
---

# ASO metadata

Writes `aso/metadata.json` (this locale's entry), `aso/metadata-<locale>.md`, and on request `aso/screenshot-brief.md`. How to write each field: `../aso/knowledge/copy.md`. What gets rejected: `../aso/knowledge/policy.md`. How to fit more into each character: `../aso/knowledge/length-and-packing.md`. Paths, gates, console: `../aso/references/conventions.md`. Bare knowledge file names (`copy.md`, `limits.json`…) are in `../aso/knowledge/`.

Needs `aso/keywords-<locale>.md`. Without it, offer `/aso-keywords` first; if declined, work from the repo and say the copy isn't keyword-targeted.

## 1. Draft

Only for the stores the app is on (or will be).

1. **Name / title** — 2–3 variants of `Brand: Head Phrase` (`copy.md`), pick one. iOS name and Play title may differ.
2. **iOS subtitle, Play short description** — 2–3 variants each, pick one.

   Fit the 30-character fields to the limit, not under it: write each variant, count it (`node -e 'console.log([...process.argv[1]].length)' "<text>"`), and if it is under 27, add the next target term that reads naturally; if over, apply the packing guidance in `length-and-packing.md` (`:` over ` - `, `&` over `and`, the shorter of two synonyms) before dropping a term. Show each variant with its count, e.g. `Habitly: Habit Tracker & Diary (30/30)`.
3. **iOS keyword field** — take the packed field from the keywords file. Don't rebuild it; if a term now repeats the name or subtitle, swap in one from the reserve.
4. **Description** — one text, adapted per store: the positioning sentence first, value paragraph, feature bullets using the feature names from `aso/context.md`. On Play the head term 3–5 times in natural sentences, in the first three sentences; never a keyword list.
5. **iOS promotional text** — three variants: evergreen, launch, time-bound. Not indexed; it's for conversion and can change without a release.
6. **What's New / release notes** — from the repo's recent commits or changelog if this is for an upcoming release; otherwise skip. Never "Bug fixes and improvements" unless that's all it is.

## 2. Grade

Write the locale's entry into `aso/metadata.json` (schema in `conventions.md`; keep other locales), then:

```
node ../aso/scripts/check.mjs aso/metadata.json
```

Fix every `✗` and run again until exit 0. Fix a `!` or say in the md why it stays. Never paste copy that fails.

Then a second reader: spawn the `aso-kit:aso-verifier` agent with the locale, this skill's `../aso` path and the `aso/` folder. Fix each FAIL, re-run `check.mjs`, verify again — two rounds at most. A FAIL still standing goes in the md under `## Open` with its quote; it is never dropped silently. Without the Agent tool, walk `../aso/references/rubric.md` yourself and say so in the md.

## 3. Write `aso/metadata-<locale>.md`

Short and paste-ready:

```markdown
> aso-metadata · <locale> · YYYY-MM-DD · check.mjs clean · rubric <n>/10

# Metadata — <locale>

## App Store
| Field | Text | Len |
| Name | Habitly: Habit Tracker | 22/30 |
| Subtitle | … | 28/30 |
| Keywords | … | 94/100 B |
| Promotional text | <evergreen> | 71/170 |

<details><summary>Description (1,240/4000)</summary>…</details>

Promotional text, other variants: launch — … · time-bound — …

## Google Play
| Field | Text | Len |
| Title | … | |
| Short description | … | |

<details><summary>Full description</summary>…</details>

## Why
- <one line per field naming the targets it carries and what changed from the live copy>

## Release plan
| Field | Ships with | Where |
| iOS name, subtitle, keywords, description | next app version | App Store Connect → version → <locale> |
| iOS promotional text | any time | App Store Connect → version page |
| Play fields | listing update, hours to 7 days | Play Console → Grow → Store listing |
```

If `fastlane/metadata/` exists, offer to write the fields there (gate 3).

Run `node ../aso/scripts/check.mjs aso/` and trim any file over its line budget. Update the state line `Metadata`.

## 4. Screenshot brief — only if wanted

Ask once: "Write a screenshot brief?" with **Yes, and open /vitrine-deck** · Yes, brief only · No. On yes, write `aso/screenshot-brief.md` in the format of `../aso/references/screenshot-brief.md`: screens from `aso/context.md`, captions that echo this locale's targets, slides 1–3 carrying the pitch. Update the state line `Screenshot brief`.

For vitrine-deck, invoke `vitrine-deck:vitrine-deck` with the Skill tool and no argument (its argument is a screenshots folder); it reads `aso/screenshot-brief.md` itself. If it isn't installed, say: the brief works for any designer, and vitrine-deck is at https://github.com/DrunkenDealer/claude-code-vitrine-deck.

## Console

```
aso-metadata · <locale> · check.mjs clean · rubric <n>/10 · fill name <n>/30, subtitle <n>/30, field <n>/100 · <n> warnings kept
→ aso/metadata-<locale>.md
```

## Rules

1. Every claim is something the app does. No numbers the developer can't prove.
2. No competitor or other-store names anywhere (`check.mjs` enforces the ones in `metadata.json`).
3. Description copy reads as written for a person; an LLM summarising it should get the positioning sentence right.
