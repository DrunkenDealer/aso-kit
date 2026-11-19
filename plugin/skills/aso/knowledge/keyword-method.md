# Keyword method

Seed → expand → score → place. Run it per store and per locale.

## 1. Seed (10–30 terms)

1. Features in the user's own words, not internal feature names.
2. The jobs and problems the app solves ("track spending", "split bills").
3. Category vocabulary.
4. Words from your own reviews and competitors' reviews.
5. How LLMs describe the category. Ask one to list apps for the job and note the words it uses.

- Customer vocabulary from reviews beats internal names; 9-step Appfigures method. [practitioner](https://appfigures.com/resources/guides/keyword-research) · 2026-11-19
- LLM prompt sourcing as a seed channel. [practitioner](https://www.moburst.com/blog/mobile-app-keyword-research-for-smarter-aso-growth/) · 2026-11-19

## 2. Expand

1. Autocomplete per locale: iOS `MZSearchHints`, Play `IJ4APc` (see `endpoints.md`). Type each seed and seed + letter.
2. Competitor gap: the top 5 apps for the core terms. Mine their name, subtitle and short description, and subtract the terms you already cover.
3. Long-tail: 2–4-word phrases with clear intent.
4. Misspellings only if the store doesn't autocorrect them.

- Competitor gap analysis on the top 5, including indirect competitors. [practitioner](https://www.moburst.com/blog/mobile-app-keyword-research-for-smarter-aso-growth/) · 2026-11-19
- Appearing in autocomplete shows that a term has demand. **Position is not a volume measure** — no store documents the order. [practitioner](https://asodesk.com/blog/new-search-suggestions-on-the-app-store-for-the-week/) · 2026-11-19
- Add misspellings only if the store doesn't autocorrect them. [practitioner](https://asodesk.com/blog/13-rules-for-working-with-app-metadata-in-the-app-store-and-google-play/) · 2026-11-19
- Apple's ranker gains most on tail queries. [official](https://machinelearning.apple.com/research/augmenting-app) · 2026-11-19
- **Disputed** — long-tail first for small apps [practitioner](https://appfigures.com/resources/guides/keyword-research) vs avoid low-volume terms when clustering intents [practitioner](https://www.apptweak.com/en/aso-blog/ai-reshaping-app-store-relevance) · 2026-11-19

## 3. Score

**Relevance is a gate, not a weight.** Drop any term whose searcher wouldn't install this app. Then score the survivors:

| Signal | iOS | Play |
|---|---|---|
| Volume | Apple Ads Search Popularity (5–100) if the user has it; otherwise autocomplete presence plus a competitor-count proxy | None official. Console search-term installs for terms you already rank on; Keyword Planner web volume as a weak proxy |
| Difficulty | Strength of the top 10 results: ratings count, big brands, exact-match titles | Same |
| Relevance | 1–3: core job / adjacent feature / loose | Same |

Rate volume, difficulty and relevance 1–3 each. Opportunity = relevance × (volume + 4 − difficulty), range 2–18. Treat it as an ordering aid, not a measurement. Keep 15–20 targets and a similar reserve.

- Apple Search Popularity is the only first-party demand number: relative, 5–100, where 5 means "below threshold". [practitioner](https://www.mobileaction.co/blog/apple-search-popularity-decoded/) · 2026-11-19
- Popularity collapsed for ~76% of US terms on 2025-09-29 and recovered with a different distribution on 2026-10-28. Don't compare values across that window, and prefer averaged readings. [data](https://aso.dev/blog/apple-ads-popularity-massive-drop/) [data](https://aso.dev/blog/apple-ads-popularity-recovery/) · 2026-11-19
- Google Play has no official volume metric; every tool's Play volume is modelled. [practitioner](https://apptweak.com/en/aso-blog/best-aso-keyword-research-tools) · 2026-11-19
- Difficulty is always a vendor model; Apple and Google publish none. [practitioner](https://help.appfigures.com/en/article/whats-keyword-competitiveness-how-is-it-calculated-and-why-is-it-important-to-know-nsdl1q/) · 2026-11-19
- Relevance comes first, and teams underrate it most. [practitioner](https://foxdata.com/en/blogs/app-store-keyword-research-framework-a-datadriven-approach-for-aso-teams-in-2026/) [practitioner](https://www.appfollow.io/blog/keyword-research-for-aso) · 2026-11-19
- Pick 15–20 priority terms for the first pass. [practitioner](https://splitmetrics.com/blog/app-store-keyword-optimization/) · 2026-11-19
- **Disputed** — thresholds such as "popularity > 25", "KD < 30" and "35–55" are tool-specific scales and don't transfer. [practitioner](https://tryastro.app/docs/data-overview-keywords) [practitioner](https://www.appfollow.io/blog/keyword-research-for-aso) · 2026-11-19
- Apple says popular terms are "highly competitive – especially if you are a newer or smaller app". [official](https://developer.apple.com/app-store/search/) · 2026-11-19

## 4. Cluster and place

1. Group terms into intent clusters: discovery (category), comparison ("for", "with", alternatives), and action.
2. iOS: put the top cluster's head term in the name, the second cluster in the subtitle, and single words from the rest in the keyword field.
3. Play: put the head term in the title, 1–2 terms naturally in the short description, and the cluster terms in the first three sentences and the feature bullets of the full description.
4. Competitor brands never go in organic metadata. They belong to paid conquesting.

- Group by semantic cluster, then by intent within each cluster. [practitioner](https://www.apptweak.com/en/aso-blog/ai-reshaping-app-store-relevance) · 2026-11-19
- Competitor brand names belong in paid campaigns, not organic metadata. [practitioner](https://www.appfollow.io/blog/keyword-research-for-aso) · 2026-11-19

## 5. Validate (optional, iOS)

Run the candidate terms as exact-match Apple Ads keywords for at least 30 days. Move the terms that convert into metadata: high popularity goes to the name or subtitle, the rest to the keyword field.

- 30-day exact-match validation before committing terms. [practitioner](https://splitmetrics.com/blog/app-store-optimization-aso-apple-search-ads-synergy/) · 2026-11-19
- Apple Ads shows terms under 10 impressions a day as "Low Volume". [practitioner](https://splitmetrics.com/blog/app-store-optimization-aso-apple-search-ads-synergy/) · 2026-11-19

## Tool metrics, translated

| Tool | Volume | Difficulty | Note |
|---|---|---|---|
| AppTweak | iOS anchored to Apple popularity; Play modelled | from top-10 App Power | Chance, KEI, Relevancy 0–100 |
| Sensor Tower | Traffic 0–10 | 1–10 | formula unpublished |
| Appfigures | Popularity 0–100 | Competitiveness 1–100 | — |
| Astro | Apple popularity, iOS only | proprietary | — |
| AppFollow | estimated monthly | KD 0–100 | — |
| MobileAction | popularity → Max Reach | 0–100 | estimated installs |

- Values don't match across tools by design. [practitioner](https://trysonar.app/aso-keyword-scores-explained) · 2026-11-19
