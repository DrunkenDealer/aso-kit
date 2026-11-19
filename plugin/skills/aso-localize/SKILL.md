---
name: aso-localize
description: Adds an App Store / Google Play locale with fresh keyword research in that market's language — keywords don't translate — plus App Store cross-localization (extra locales a storefront also indexes) and a native-speaker review gate. Triggers on "localize my app listing", "ASO for Germany", "add Spanish App Store keywords", "cross-localization".
user-invocable: true
argument-hint: "<locale>  e.g. de-DE, es-MX, ja"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Skill, AskUserQuestion
---

# ASO localize

Produces `aso/keywords-<locale>.md`, `aso/metadata-<locale>.md` and the locale's entry in `aso/metadata.json`. Method: `../aso/knowledge/localization.md`. Paths, gates, console: `../aso/references/conventions.md`. Bare knowledge file names (`copy.md`, `limits.json`…) are in `../aso/knowledge/`.

Needs the primary locale done (`aso/metadata.json` has it). Without it, say so and offer `/aso-metadata` for the primary first.

## 1. Pick the locale's job

From the storefront table in `localization.md`:

- **Market locale** — the storefront's default language (de-DE for Germany). Full listing, real copy.
- **Cross-localization slot** — an extra locale a storefront also indexes (es-MX in the US, en-GB almost everywhere outside the US). On iOS it adds 160 indexed characters; its name and subtitle must still read as genuine copy in that language, because some users see them.

Say which job this locale has, and for a slot which storefronts it reaches.

## 2. Research and write

1. Run `/aso-keywords <locale>` with the Skill tool. Seeds come from that market's language and its own competitors — never a translation of the primary list.
2. For a cross-localization slot, its keyword field must not repeat a word from the default locale's name, subtitle or keywords in the same storefront: those are already indexed there.
3. Run `/aso-metadata <locale>`. It grades with `check.mjs`, which applies the locale's banned words (`limits.json` → `banned.locale`).

Market notes worth checking:

- **de** — compounds index as one word (`Gewohnheitstracker` ≠ `Gewohnheit Tracker`); check both in suggest.
- **pt-BR vs pt-PT, es-MX vs es-ES** — separate vocabularies; on iOS separate storefronts.
- **ja, ko, zh** — no spaces between words; the keyword field budget is in bytes (3 per CJK character in UTF-8).
- **Plurals** — outside English Apple may not fold them (`ios-metadata.md`); keep the form the suggestions show.

## 3. Native review gate

Before the copy is final, one `AskUserQuestion`:

- **Reviewed by a native speaker** — mark the locale `final`.
- **Ship as draft** — mark it `draft` in the md header and in the state line.
- **Hold** — leave the files, don't update the state line.

## Console

```
aso-localize · <locale> · <market | slot for us, ca> · <final | draft> · field <n>/100 bytes
→ aso/metadata-<locale>.md
```

Update the state line `Localized` with the locale appended.
