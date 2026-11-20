# ASO knowledge base

Store facts and method the aso-kit skills reason from. Skills cite these files; they never restate them.

| File | Holds |
|---|---|
| `ios-metadata.md` | App Store fields, limits, what is indexed, keyword-field rules, CPP/PPO/events |
| `play-metadata.md` | Google Play fields, limits, what is indexed, CSL, experiments, promo content |
| `policy.md` | Banned words and rejection triggers per store and field |
| `ranking.md` | How each store ranks, AI surfaces (Tags, Ask Play, LLM search) |
| `keyword-method.md` | Seed → expand → score, volume proxies, tool metrics, thresholds |
| `copy.md` | How to write each field, AI-readable positioning, screenshot captions |
| `length-and-packing.md` | What each character buys: separators, free indexed words, what folds (plurals, accents, compounds, misspellings), expansion ratios |
| `localization.md` | Per-language research, iOS storefront × locale indexing table |
| `endpoints.md` | Unofficial store endpoints, request shapes, probe status |
| `myths.md` | Contested claims and recycled stats — what not to repeat |
| `changelog.md` | Store changes 2025–2026, newest first |
| `limits.json` | Machine copy of field limits and banned tokens for `aso-kit check` |

## Claim format

Every fact is a `- ` bullet ending in its evidence and the date it was last verified:

```
- iOS subtitle max 30 characters. [official](https://developer.apple.com/…) · 2026-11-19
```

Evidence tags, strongest first:

- `official` — Apple or Google page, release note, policy, WWDC/I/O session, Apple ML paper.
- `data` — a study with a stated sample or controlled test (vendor studies included).
- `practitioner` — vendor, agency or press opinion. Directional; most sellers sell the tool they recommend.
- `probe` — a request we ran ourselves; the date is the probe date.

Our own guidance derived from the facts goes in numbered lists or prose, never in `- ` bullets, so drift checks can tell the two apart.

A claim with only `practitioner` evidence is never stated as a rule — skills say "practitioners report". Where sources conflict the bullet says **Disputed** and lists both sides.

## Updating

`/aso-refresh` re-fetches each cited URL, re-runs the probes in `endpoints.md`, and proposes patches with the new date. `aso-kit drift` fails when a bullet lacks evidence or a date, when `limits.json` disagrees with the tables, or when a claim is older than 180 days.
