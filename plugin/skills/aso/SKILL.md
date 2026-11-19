---
name: aso
description: App Store Optimization for the text side of an App Store and Google Play listing — title, subtitle, keyword field, short and full description, promotional text, What's New — from the app's own repo, live store data and a dated knowledge base. Walks context → keywords → metadata → audit with a gate between steps, and can hand a screenshot brief to /vitrine-deck. Triggers on "ASO", "app store optimization", "optimize my app listing", "improve my app store ranking", "where do I start with ASO".
user-invocable: true
argument-hint: "[continue | <locale>]"
allowed-tools: Read, Glob, Grep, Bash, Skill, AskUserQuestion
---

# ASO

Runs the aso-kit skills in order and decides nothing they decide. Each step also runs on its own; this is only the route through them.

Read `references/conventions.md` first: output paths, the state block, the console format and the gates live there, and this skill follows them like every other.

## The route

| Step | Skill | Needs | Gives |
|---|---|---|---|
| 1 | `/aso-context` | the repo | `aso/context.md`, live snapshots |
| 2 | `/aso-keywords <locale>` | context | `aso/keywords-<locale>.md` |
| 3 | `/aso-metadata <locale>` | context, keywords | `aso/metadata.json`, `aso/metadata-<locale>.md`, optional `aso/screenshot-brief.md` |
| 4 | `/aso-audit` | a live listing, or `aso/metadata.json` | `aso/audit.md` |
| per extra market | `/aso-localize <locale>` | steps 1–3 in the primary locale | the same files for that locale |
| maintenance | `/aso-refresh` | — | an updated knowledge base |

Screenshots are not a step. `/aso-metadata` offers a brief; `/vitrine-deck` builds from it if the developer has it installed.

## Process

1. **Where are we.** No `aso/context.md` → run `/aso-context`, no gate. Otherwise print the state block and the first line that is `—` or older than the line before it (keywords newer than metadata means metadata is stale).
2. **Gate.** One `AskUserQuestion`: run the proposed step (recommended), pick another, or stop. Invoke the chosen skill with the Skill tool and let it finish — its own console lines are the report.
3. **Repeat** until the developer stops or steps 1–4 are filled for the primary locale. Then offer `/aso-localize` for each market in `aso/context.md` that has no keywords file.
4. **Done:**
   ```
   aso · <app> · text ASO done for <locales>
   Re-audit after each release that changes copy · re-research keywords every ~3 months · /aso-refresh before a new app
   ```

`$ARGUMENTS`: `continue` skips step 1's printout and runs the next step's gate; a locale scopes steps 2–3 to it.

## Rules

1. **Write nothing.** Every file and every state line belongs to the skill that produced it.
2. **Rating first.** If the rating in `aso/context.md` is below 4.0, say so at the first gate (`knowledge/ranking.md`) — the developer chooses.
3. **Primary locale before others.** Localizing a listing that doesn't work yet copies what doesn't work.
4. **One change per release** when measuring: several text changes at once can't be told apart (`knowledge/ranking.md`).
