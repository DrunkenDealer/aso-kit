---
name: aso-localize
description: Adds one App Store / Google Play locale after the English listing is live and measured — fresh keyword research in that market's language (keywords don't translate), copy checked for the same meaning as English, App Store cross-localization, a native-speaker review gate. A separate step, never part of the default flow; warns before a first or a parallel localization. Triggers on "localize my app listing", "ASO for Germany", "add Spanish App Store keywords", "cross-localization".
user-invocable: true
argument-hint: "<one locale>  e.g. de-DE, es-MX, ja"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Skill, AskUserQuestion
---

# ASO localize

Produces `aso/keywords-<locale>.md`, `aso/metadata-<locale>.md` and the locale's entry in `aso/metadata.json`. Method: `../aso/knowledge/localization.md`. Paths, gates, console: `../aso/references/conventions.md`. Bare knowledge file names (`copy.md`, `limits.json`…) are in `../aso/knowledge/`.

## 0. Gate

A separate step, one locale per run. The primary locale (`en-US` unless the app has no English listing) is the source; every other locale is built from its live, measured version. Read `aso/changelog.md` (format in `conventions.md`) and collect every warning that applies:

| Finding | Warning |
|---|---|
| No changelog row for the primary | The primary listing isn't written yet. Recommend `/aso-metadata` for it first. |
| The primary's latest row is `ready`, or `live` less than ~4 weeks ago (iOS; 6–8 weeks on Play) | The source isn't proven yet: localizing it copies what may not work. Recommend waiting until <date>. |
| No other locale in the changelog — a first localization | Show once: localization pays one market at a time, with fresh research and a measured result before the next; many markets at once by machine translation, unmeasured, is what fails (`localization.md` § Sequencing). |
| More than one locale asked for | Take one — the one with traction or listed first in `aso/context.md` → Markets — and name the rest as next. |
| Another non-primary locale is `ready` or `live` inside its window | One at a time: measure <locale> first. |
| This locale exists and its `Built on` is older than the primary's latest `live` row | The source changed: recommend updating this locale from the current primary (the usual reason to re-run). |

No warnings → go on. Otherwise one `AskUserQuestion` listing them, with **Wait** (recommended unless the only finding is the last row) · **Proceed anyway** · and, where a row recommends a skill, that skill. Proceeding anyway is recorded in the changelog row's Change cell (`against gate: <reason>`).

A cross-localization slot counts as a locale here: one at a time, same windows.

## 1. Pick the locale's job

From the storefront table in `localization.md`:

- **Market locale** — the storefront's default language (de-DE for Germany). Full listing, real copy.
- **Cross-localization slot** — an extra locale a storefront also indexes (es-MX in the US, en-GB almost everywhere outside the US). On iOS it adds 160 indexed characters; its name and subtitle must still read as genuine copy in that language, because some users see them.

Say which job this locale has, and for a slot which storefronts it reaches.

## 2. Research and write

1. Run `/aso-keywords <locale>` with the Skill tool. Seeds come from that market's language and its own competitors — never a translation of the primary list.
2. For a cross-localization slot, its keyword field must not repeat a word from the default locale's name, subtitle or keywords in the same storefront: those are already indexed there.
3. Run `/aso-metadata <locale>`. It grades with `check.mjs`, which applies the locale's banned words (`limits.json` → `banned.locale`), then with `aso-verifier`; for a slot, tell it so, so rubric item 10 applies.

The copy is written fresh in the locale's language to its own limits — never the English copy translated and trimmed. A 30-character English field grows 60–80% in most European languages, and German fills the subtitle hardest (`length-and-packing.md`). Where two local words mean the same, take the one autocomplete shows, then the shorter.

Market notes worth checking:

- **de, nl** — compounds partly match their split form; use the compound in the name and add the head noun alone to the keyword field. `ue` for `ü` is a different query.
- **pt-BR vs pt-PT, es-MX vs es-ES** — separate vocabularies; on iOS separate storefronts.
- **ja, ko, zh** — no spaces between words; the keyword field counts characters, so one CJK character costs 1 and the field holds about twice as many terms. Kana and kanji fold; romaji doesn't on Play.
- **Plurals** — outside English both stores treat them as separate queries (`length-and-packing.md`); put the suggested form in name or subtitle and the other in the keyword field if it fits.

## 3. Native review gate

Before the copy is final, one `AskUserQuestion`:

- **Reviewed by a native speaker** — mark the locale `final`.
- **Ship as draft** — mark it `draft` in the md header and in the state line.
- **Hold** — leave the files, don't update the state line.

## Console

```
aso-localize · <locale> · <market | slot for us, ca> · <final | draft> · rubric <n>/<n> · field <n>/100 chars
→ aso/metadata-<locale>.md
```

Update the state line `Localized` with the locale appended.
