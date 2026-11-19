---
name: aso-refresh
description: Re-verifies aso-kit's own knowledge base — App Store and Google Play field limits, indexing, policy, endpoints — against the cited official pages and live probes, and proposes dated patches where a fact has drifted. Maintenance, not an ASO step; run it quarterly, after WWDC or Google I/O, or before starting a new app. Triggers on "refresh ASO knowledge", "are the ASO facts still current", "aso-refresh".
user-invocable: true
argument-hint: "[knowledge file, default all]"
allowed-tools: Read, Write, Edit, Glob, Bash, WebFetch, WebSearch, AskUserQuestion
---

# ASO refresh

Keeps `../aso/knowledge/` true. Claim format and evidence tags: `../aso/knowledge/README.md`.

## 1. Check

1. `node ../aso/scripts/drift.mjs` — malformed or stale bullets, `limits.json` disagreeing with the tables.
2. `node ../aso/scripts/store.mjs probe` — every endpoint in `endpoints.md`.
3. For each `- ` bullet with an `official` link: fetch the page, find the claim. Practitioner links only if the claim is the bullet's only evidence.
4. One `WebSearch` per store for changes since the newest date in `changelog.md`: "App Store Connect release notes", "Google Play Console what's new", plus the latest WWDC / I/O if one happened since.

## 2. Classify

| Status | Means |
|---|---|
| Confirmed | source still says it — new date only |
| Drifted | source says something else — new text and date |
| Unverifiable | page gone or claim no longer on it — find a replacement source or mark **Disputed** |
| New | a store change with no bullet yet — a bullet in the right file plus a `changelog.md` line |

## 3. Gate

Show the Drifted, Unverifiable and New rows as a table (file, old, new, source). One `AskUserQuestion`: apply all · pick · write the patch only. Never edit before the answer.

## 4. Apply

- Edit the bullets; Confirmed ones get today's date.
- A changed limit goes to the table **and** `limits.json` (`verified` too).
- A failed probe: fix `store.mjs` if the new shape is clear; otherwise mark it failing in `endpoints.md`.
- `node ../aso/scripts/drift.mjs` must pass.

Run outside an aso-kit checkout (an installed plugin is overwritten on update): write the patch to `aso/refresh-YYYY-MM-DD.md` instead and point at https://github.com/DrunkenDealer/claude-code-aso-kit/issues.

## Console

```
aso-refresh · all · <n> confirmed · <n> drifted · <n> new · probes <n>/<n>
→ <changed files | aso/refresh-YYYY-MM-DD.md>
```
