# Policy: what gets metadata rejected

The token lists live in `limits.json` (`banned`), and `aso-kit check` applies them per field. This file gives the reasons behind them.

## App Store

| Rule | Applies to | Guideline |
|---|---|---|
| No trademarks, popular app names, competitor or celebrity names, pricing, irrelevant phrases | All metadata, especially keywords | 2.3.7, 5.2.1 |
| No unverifiable claims, no references to other apps | Subtitle | 2.3.7 |
| No prices or terms not specific to the field | Name, subtitle, screenshots, previews | 2.3.7 |
| No other platforms or alternative marketplaces (Android, Google Play…) | All metadata | 2.3.10 |
| "For Kids" / "For Children" reserved for the Kids category; 4+ suitable | All metadata | 2.3.8 |
| What's New must describe significant changes specifically | What's New | 2.3.12 |
| Event text about the event, no prices | In-App Events | 2.3.13 |
| No misleading promotion of content or price | Everywhere, inside or outside the store | 2.3.1 |
| Must not look like Apple products; no Apple emoji | All | 5.2.5 |

- All rows: [official](https://developer.apple.com/app-store/review/guidelines/) · 2026-11-19
- "Improper keywords" are "a common reason for App Store rejections". [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- Avoid "world's best app"-style phrases in the subtitle. [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Competitor brands in keywords: Apple may block the term or remove the app. [practitioner](https://www.apptweak.com/en/aso-blog/how-to-optimize-your-ios-keyword-field) · 2026-11-19

## Google Play

| Rule | Applies to | Source |
|---|---|---|
| No store-performance or ranking claims: "#1", "Best", "Top", "Popular", "App of the year", "Best of Play", "Million Downloads", award icons | Title, icon, developer name, short description, all graphics | Metadata policy and preview-asset rules |
| No price or promotional text: "Free", "No Ads", "Discount", "Sale", "% off", "cash back", "free for limited time" | Title, developer name, short description, graphics | Metadata policy and best practices |
| No Play-program references: "Editor's choice", "New" | Title, icon, developer name, graphics | Metadata policy |
| No emoji, emoticons, kaomoji, repeated special characters, ALL CAPS (unless brand) | Title, icon, developer name; short description and graphics | Metadata policy and preview-asset rules |
| No call-to-action text ("download now", "install now", "play now", "try now") | Short description, graphics | Preview-asset rules |
| No unattributed or anonymous testimonials | Description | Metadata policy |
| No "best", "#1 rated" or comparisons with other apps or brands | Full description | Best practices and Metadata policy |
| No repetitive or unrelated keywords, word blocks, keyword lists | Title, short and full description | Metadata policy |
| No celebrity names or brand logos without permission | All | Metadata policy |
| Policies apply to every translation | All locales | Best practices |

- Metadata policy text. [official](https://support.google.com/googleplay/android-developer/answer/9898842) · 2026-11-19
- "Free" and "No Ads" don't belong in titles or developer names; short description must not have pricing or ranking. Full description must not say "best" or "#1 rated" or compare. [official](https://support.google.com/googleplay/android-developer/answer/13393723) · 2026-11-19
- Preview assets must not say "Best", "#1", "Top", "New", "Discount", "Sale", "Million Downloads"; no CTAs; no emoji, ★, repeated punctuation, line breaks or caps for emphasis. ©®™ are allowed. [official](https://support.google.com/googleplay/android-developer/answer/9866151) · 2026-11-19
- Repetitive keyword use "can … result in app suspension." [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19
- No manipulation of ratings, reviews or installs, including incentivized feedback. [official](https://support.google.com/googleplay/android-developer/answer/9898684) · 2026-11-19
- The Metadata policy itself lists "#1" and "New". "Best", "Top" and "Free" come from the best-practices and preview-asset pages. Both count as enforcement. [official](https://support.google.com/googleplay/android-developer/answer/9898842) · 2026-11-19

## Both stores

1. Never name the other store or platform in metadata ("also on Android", "iPhone version").
2. Claims must be verifiable inside the app. Stats ("10M users") only if the developer can prove them.
3. Localized copy gets the same checks. Per-locale banned words (gratis, kostenlos, 免费, бесплатно…) are listed in `limits.json`.
