# App Store metadata

## Fields

| Field | Limit | Indexed for search | Changes need a new version |
|---|---|---|---|
| App name | 2–30 chars | Yes — strongest | Yes |
| Subtitle | 30 chars | Yes | Yes |
| Keyword field | 100 (bytes per ASC Help, characters per guides) | Yes | Yes |
| Developer (company) name | — | Yes | — |
| Primary / secondary category | — | Yes | Yes |
| Promotional text | 170 chars | **No** | No — edit any time |
| Description | 4000 chars, plain text | **No** (App Store); used for web search | Yes |
| What's New | 4000 chars | No | Yes (required after v1) |
| In-App Event name / short / long | 30 / 50 / 120 | Event is searchable; app-ranking effect disputed | Reviewed separately |
| In-App Purchase display name / description | 30 / 45 (stricter of Apple's two figures) | Yes | Reviewed with the IAP |
| Custom product page promotional text | 170 chars | No | Reviewed per page |

- Name 2–30 chars; editable only with a new version once submitted. [official](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information) · 2026-11-19
- Name, subtitle, keywords, description, What's New and categories are version-bound; promotional text and IAP display names are not. [official](https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties) · 2026-11-19
- Keyword field: "up to 100 bytes", each keyword "greater than two characters". [official](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) · 2026-11-19
- Keyword field: "100 characters", comma-separated, no spaces after commas; spaces allowed inside a phrase. [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- **Disputed** — bytes vs characters. Budget by bytes: Cyrillic, Arabic, CJK fit fewer terms. [official](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) · 2026-11-19
- "Your app is searchable … by app name, app subtitle, keywords, and your company name." [official](https://developer.apple.com/help/app-store-connect/create-an-app-record/view-and-edit-app-information) · 2026-11-19
- Text relevance = title, subtitle, keywords, primary category; primary and secondary categories are indexed. [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- Promotional text "doesn't affect your app's search ranking so it should not be used to display keywords." [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Description not indexed for App Store search. [practitioner](https://appfigures.com/resources/guides/app-store-algorithm-update-2025) [practitioner](https://www.mobileaction.co/guide/ios-appstore-aso-guide/) · 2026-11-19
- Description "will be used for web engine search results". [official](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) · 2026-11-19
- The first sentence of the description is the most important — readable without tapping More. [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Subtitle often truncated near 26 chars in search; front-load. [practitioner](https://www.apptweak.com/en/aso-blog/app-store-product-page-optimization) · 2026-11-19
- Changes may take up to 24 hours to appear. [official](https://developer.apple.com/help/app-store-connect/create-an-app-record/view-and-edit-app-information) · 2026-11-19
- Universal purchase: name and subtitle are shared across platforms; description can differ. [official](https://developer.apple.com/videos/play/wwdc2026/8010/) · 2026-11-19

## Keyword field rules

1. Comma-separated, no spaces after commas, no special characters (they become spaces and waste budget).
2. Don't repeat a word already in the name, subtitle, developer name or category — repeats are ignored.
3. Singular forms; one form per word. In non-English locales check whether the plural ranks separately.
4. Single words over phrases — Apple combines words across name, subtitle and keyword field **within one locale**.
5. Leave out: `app`, `game`, category names, filler (`the`, `to`, `and`), `free`, `iphone`, `ipad`, `new`, `best`, trademarks, competitor app names, celebrity names.
6. Each keyword > 2 characters.
7. Fill to ≥ 90 of 100.

- "Don't repeat any words included in your app name, subtitle, or category." [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- Plurals of words already present in singular "are considered duplicates". [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- **Disputed** — English plurals auto-match; other languages may not ("animal" vs "animaux"). [practitioner](https://www.apptweak.com/en/aso-blog/how-to-optimize-your-ios-keyword-field) · 2026-11-19
- Don't duplicate app or company name in keywords; "Names of other apps or companies aren't allowed." [official](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) · 2026-11-19
- Avoid "app", "game", category names, filler words, special characters; never trademarks, celebrity or competing app names. [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- "Special characters don't carry extra weight." [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Repeated words are ignored, not boosted; pick words that combine into phrases. [practitioner](https://appfigures.com/resources/keyword-optimization-app-store-connect) · 2026-11-19
- Words combine only within one localization. [data](https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store) [practitioner](https://www.mobileaction.co/blog/app-store-cross-localization/) · 2026-11-19
- "Apple may modify inappropriate keywords at any time" (2.3.7). [official](https://developer.apple.com/app-store/review/guidelines/) · 2026-11-19

## Custom Product Pages

- Up to 70 per app; vary screenshots, previews, promotional text and keywords; localizable; unique URL. [official](https://developer.apple.com/help/app-store-connect/create-custom-product-pages/configure-multiple-product-page-versions) · 2026-11-19
- CPP keywords are picked **from the latest approved version's keywords** — they route a query to the CPP, they add no new indexed terms. Give each page a unique keyword set. [official](https://developer.apple.com/help/app-store-connect/create-custom-product-pages/configure-multiple-product-page-versions) · 2026-11-19
- Searchable only after approval and set visible. [official](https://developer.apple.com/help/app-store-connect/create-custom-product-pages/configure-multiple-product-page-versions) · 2026-11-19
- Limit raised 35 → 70 on 2025-10-28. [official](https://developer.apple.com/help/app-store-connect/release-notes/) · 2026-11-19

## Product Page Optimization

- Tests icon, screenshots, previews only — **no text fields**. Up to 3 treatments, one test at a time, up to 90 days; Apple suggests 90% confidence. [official](https://developer.apple.com/app-store/product-page-optimization/) · 2026-11-19
- Creative assets (header, search-result visual) are testable per What's New; the PPO page doesn't list them yet. [official](https://developer.apple.com/app-store/whats-new/) · 2026-11-19
Text changes can only be measured before/after: one change per release, equal-length windows, ~4 weeks to settle (`ranking.md`).

## In-App Events

- Name 30 (title case), short 50, long 120; 10 published / 15 approved; up to 31 days; promotable 14 days ahead; reviewed without a version. [official](https://developer.apple.com/app-store/in-app-events/) · 2026-11-19
- Prices in event metadata lead to rejection. [official](https://developer.apple.com/app-store/in-app-events/) · 2026-11-19
- **Disputed** — event text as an app-ranking input. For: [practitioner](https://www.apptweak.com/en/aso-blog/app-store-ranking-factors) [practitioner](https://splitmetrics.com/blog/apple-app-store-ranking-factors/). Apple says only that events are searchable directly. [official](https://developer.apple.com/app-store/in-app-events/) · 2026-11-19

## In-App Purchases

- Searches use "app and in-app purchase metadata"; promoted non-consumable IAPs can appear in results. [official](https://developer.apple.com/app-store/discoverability/) [official](https://developer.apple.com/app-store/promoting-in-app-purchases/) · 2026-11-19
- **Disputed** — IAP display-name limit 30 or 35, description 45 or 55; Apple pages disagree. [official](https://developer.apple.com/app-store/promoting-in-app-purchases/) · 2026-11-19

## Screenshots (for the brief only)

- First 1–3 screenshots show in search when no preview video is set. [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Up to 10 per device size; iPhone Duo required from April 2027 for apps on the iOS 27.1 SDK+. [official](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) · 2026-11-19
- Creative assets (product page header, 3:2 search-result visual) shipped 2026-10-05; reviewed independent of a version. [official](https://developer.apple.com/help/app-store-connect/release-notes/) · 2026-11-19

## No keyword data in App Store Connect

- "We don't provide keyword level data in ASC." Proxy: CPP analytics filtered to source "App Store search" (includes Apple Ads traffic). [official](https://developer.apple.com/videos/play/wwdc2026/8010/) · 2026-11-19
- Claims of ASC keyword analytics since July 2026 were retracted by their source on 2026-09-11. [practitioner](https://appdrift.co/blog/app-store-connect-keyword-analytics) · 2026-11-19
