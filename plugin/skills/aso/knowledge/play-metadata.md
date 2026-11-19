# Google Play metadata

## Fields

| Field | Limit | Indexed for search | Review |
|---|---|---|---|
| App name (title) | 30 chars (full- and half-width count the same) | Yes — strongest | Yes |
| Short description ("Promotional description") | 80 chars | **Disputed** (see below) | Yes |
| Full description | 4000 chars | Yes | Yes |
| Developer name | — | Low weight (practitioner) | Yes |
| Release notes | 500 chars per language | Unverified | With release |
| Tags | max 5 | Relevance/category signal, Gemini matching | — |
| Promotional content | tagline ~80, description ~500 (practitioner) | Practitioner says yes | Up to 4 days |

There is no hidden keyword field. Listing text is per language, shared across tracks.

- Title 30, short description 80, full description 4000. [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19
- "Character limits apply to both full-width and half-width characters." [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19
- Release notes up to 500 Unicode characters per language. [official](https://support.google.com/googleplay/android-developer/answer/9859348) · 2026-11-19
- Max five tags; change only after significant content changes. [official](https://support.google.com/googleplay/android-developer/answer/9859673) · 2026-11-19
- "Regularly update your descriptions, tags, and events" — Gemini matches requests to listings. [official](https://android-developers.googleblog.com/2026/10/new-tools-for-discovery-and-engagement.html) · 2026-11-19
- Store listing is shared across tracks, including testing tracks. [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19
- Google names no indexed fields — only "The text in your store listing helps users discover your app". [official](https://support.google.com/googleplay/android-developer/answer/4448378) · 2026-11-19
- Indexed: title (highest), short description, full description; developer name at low weight. [practitioner](https://trysonar.app/blog/how-play-store-ranking-works) [practitioner](https://asomobile.net/en/blog/app-listings-in-google-play-2026/) · 2026-11-19
- Short description is "Promotional description" in Google's best-practices page and "appears in places like search results". [official](https://support.google.com/googleplay/android-developer/answer/13393723) · 2026-11-19
- **Disputed** — short description and ranking. Google: stuffing it with keywords "will not impact ranking". [official](https://support.google.com/googleplay/android-developer/answer/9866151). Practitioners rank it second after the title. [practitioner](https://appradar.com/academy/aso-basics/app-store-ranking-factors) [practitioner](https://trysonar.app/blog/how-play-store-ranking-works) · 2026-11-19
- Full description: users read the first few sentences; don't repeat the short description. [official](https://support.google.com/googleplay/android-developer/answer/13393723) · 2026-11-19
- "Use SEO best practices in your 'Description'" within spam policy; most important text in the top half. [official](https://support.google.com/googleplay/android-developer/answer/4448378) · 2026-11-19
- First 250–300 chars of the full description carry the most weight. [practitioner](https://appradar.com/academy/aso-basics/app-store-ranking-factors) · 2026-11-19
- Tags are global, not per language. [practitioner](https://trysonar.app/blog/how-play-store-ranking-works) · 2026-11-19

## Keyword use in the full description

No official density figure exists. Working rule: primary keyword 3–5 times in natural sentences, in the first three sentences and in feature bullets; total keyword density under ~4%; never a keyword list.

- Primary 2–3%, secondary 1–2%. [practitioner](https://www.apptweak.com/en/aso-blog/app-store-description-best-practices) · 2026-11-19
- Primary 3–5 mentions, total under 4%; above 6% reads as stuffing. [practitioner](https://appdrift.co/blog/google-play-description-optimization) · 2026-11-19
- "Precision over density" — semantic relevance beats counts. [practitioner](https://asomobile.net/en/blog/app-listings-in-google-play-2026/) · 2026-11-19
- "Give an overview … using everyday language, not a list of keywords." [official](https://support.google.com/googleplay/android-developer/answer/13393723) · 2026-11-19
- Repetitive or irrelevant keywords in name, short or full description "can … result in app suspension." [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19

## Review and timing

- Listing changes take "a few hours or up to seven days"; plan a week's buffer. Each submission restarts the clock. [official](https://support.google.com/googleplay/android-developer/answer/9859654) · 2026-11-19
- Managed publishing holds listing and CSL changes until you publish. [official](https://support.google.com/googleplay/android-developer/answer/9859654) · 2026-11-19
- Ranking effect of text changes shows in 4–8 weeks; title and short description register first. [practitioner](https://appradar.com/academy/aso-basics/app-store-ranking-factors) [practitioner](https://trysonar.app/blog/how-play-store-ranking-works) · 2026-11-19

## Custom store listings (CSL)

- Up to 50; target by country, pre-registration, churned users, ads traffic, custom audiences, or **search keywords**. Keyword bundles include spelling variants and translations. Not auto-translated. [official](https://support.google.com/googleplay/android-developer/answer/9867158) · 2026-11-19
- Gemini generates a keyword-tailored CSL from Console's recommended keywords (I/O 2026). [official](https://android-developers.googleblog.com/2026/05/io-2026-whats-new-in-google-play.html) · 2026-11-19
- Only keywords from Google's suggested list can be targeted. [practitioner](https://www.gummicube.com/blog/what-are-google-custom-store-listings) · 2026-11-19
- For per-country (not per-language) copy, use a CSL. [official](https://support.google.com/googleplay/android-developer/answer/9844778) · 2026-11-19

## Store listing experiments

- Text can be tested — localized experiments, up to 5 languages, up to 2 variants + control, one default-graphics experiment or up to five localized at a time; metric is unique install/open/pre-register clicks; auto-stop after 6 months. [official](https://support.google.com/googleplay/android-developer/answer/6227309) · 2026-11-19
- **Disputed** — confidence: Console default 90% [practitioner](https://phiture.com/asostack/google-play-experiments-a-technical-deep-dive-into-the-new-updates/); AppTweak recommends 95%, MDE 0.5–3% [practitioner](https://www.apptweak.com/en/aso-blog/google-i-o-2026-aso-updates) · 2026-11-19

## Metrics

- Listing performance is CTR on unique clicks (Install/Open/Pre-register) since June 2026, replacing "Conversion Rate"; "Search term" is a report dimension. [official](https://support.google.com/googleplay/android-developer/answer/9859173) · 2026-11-19
- Play publishes no search-volume metric; Console shows installs per search term you already rank on. [practitioner](https://www.yellowhead.com/?p=3805) · 2026-11-19

## Promotional content

- Shown on the listing, may appear on Home and in search; offers, time-limited events, major updates. Approval up to 4 days; submit ≤ 60 days ahead; 14+ days ahead to request featuring. [official](https://support.google.com/googleplay/android-developer/answer/12932541) · 2026-11-19
- **Disputed** — max duration "four weeks" vs "must end within 30 days" on the same page. [official](https://support.google.com/googleplay/android-developer/answer/12932541) · 2026-11-19

## Graphics (for the brief only)

- Preview assets (short description, icon, feature graphic, screenshots, video): no ranking, price, award, testimonial or CTA text. See `policy.md`. [official](https://support.google.com/googleplay/android-developer/answer/9866151) · 2026-11-19
