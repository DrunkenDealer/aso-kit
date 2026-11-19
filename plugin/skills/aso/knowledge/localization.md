# Localization

Keywords don't translate. Research each market natively: local autocomplete, the local top 10, local vocabulary. Then have a native speaker review the copy.

- Research every market natively; translation alone underperforms (AU "pokies" vs "slots"). [practitioner](https://www.apptweak.com/en/aso-blog/guide-to-app-store-localization) [practitioner](https://splitmetrics.com/blog/app-localization/) · 2026-11-19
- Prioritise markets with existing organic traction; roll out in phases. [practitioner](https://www.apptweak.com/en/aso-blog/guide-to-app-store-localization) · 2026-11-19
- AI discovery features run in US English first, so localized markets still run on classic keyword ASO. [practitioner](https://www.apptweak.com/en/aso-blog/google-i-o-2026-aso-updates) · 2026-11-19

## Sequencing

- Spreading effort across many languages gives "15 half-baked localizations instead of two or three good ones"; pick one or two markets, get downloads and reviews there, then expand. [practitioner](https://appopportunity.com/blog/app-localization-mistakes) · 2026-11-19
- Machine-translated copy comes out grammatically correct but not natural, and native speakers notice; one native review pass is the fix. [practitioner](https://appopportunity.com/blog/app-localization-mistakes) · 2026-11-19
- "Do not start with 30 languages because the tool can do it"; pilot one locale end to end and treat it as a launch experiment, tracked per locale. [practitioner](https://www.applaunchflow.com/blog/how-to-localize-an-app) · 2026-11-19
- Research a short list of countries, test one first, track it for at least one ASO cycle, then keep, improve or drop it — "better than translating ten listings and hoping one works". [practitioner](https://appsprint.app/blog/app-store-localization-aso) · 2026-11-19
- Change one element per update cycle; ranking shifts show in 7–14 days, download data needs ~30 days, and readings in the first 3–5 days mislead. [practitioner](https://foxdata.com/en/blogs/how-to-use-aso-impact-analysis-to-measure-keyword-changes/) · 2026-11-19

What these sources warn against is localizing many markets at once by machine translation, without research and without measuring — not localization itself. Our sequence:

1. The primary locale (`en-US` unless the app has no English listing) ships first and is measured for a full window (`ranking.md`: iOS ~4 weeks, Play 6–8 weeks).
2. Then one more locale, researched in its own language and reviewed by a native speaker, built from the primary's live copy. Its window runs before the next locale starts.
3. When the primary changes, locales built on the older version are stale; update them one at a time, the same way.
4. `aso/changelog.md` records each step, so the gate in `/aso-localize` and `/aso-audit` can tell what is live, what is still in its window, and what is stale.

## App Store: storefronts index more than one locale

If you add a language, users "can search for your app using localized keywords in all countries or regions where the App Store supports" it. New localizations don't inherit keywords from the primary language. Each extra indexed locale adds 160 characters of searchable text (30 + 30 + 100).

- Localized keywords are searchable wherever the language is supported; keywords don't default from the primary language. [official](https://developer.apple.com/help/app-store-connect/manage-app-information/localize-app-store-information) · 2026-11-19
- Storefront default and additional languages table. [official](https://developer.apple.com/help/app-store-connect/reference/app-store-localizations) · 2026-11-19
- Practitioner tests confirm that the US indexes the 9 additional locales below. Apple doesn't document indexing explicitly. [data](https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store) [practitioner](https://www.mobileaction.co/blog/app-store-cross-localization/) · 2026-11-19

| Storefront | Default | Additional (indexed) |
|---|---|---|
| United States | en-US | ar, zh-Hans, zh-Hant, fr, ko, pt-BR, ru, es-MX, vi |
| United Kingdom | en-GB | — |
| Canada | en-CA | fr-CA |
| Australia, New Zealand | en-AU | en-GB |
| Ireland, South Africa, Nigeria, Philippines | en-GB | — |
| India | en-GB | bn, gu, hi, kn, ml, mr, or, pa, ta, te, ur |
| Singapore | en-GB | zh-Hans |
| Mexico, Argentina, Chile, Colombia | es-MX | en-GB |
| Spain | es-ES | ca, en-GB |
| Brazil | pt-BR | en-GB |
| Portugal | pt-PT | en-GB |
| France, Germany, Italy, Netherlands, Sweden, Austria | local | en-GB |
| Switzerland | de | en-GB, fr, it |
| Belgium | en-GB | nl, fr |
| Japan | ja | en-US |
| Korea | ko | en-GB |
| China mainland | zh-Hans | en-GB |
| Hong Kong, Taiwan | zh-Hant | en-GB |
| Russia | ru | en-GB, uk |
| Ukraine | en-GB | ru, uk |
| Saudi Arabia, UAE | en-GB | ar |
| Egypt, Algeria | en-GB | ar, fr |
| Türkiye, Thailand, Indonesia, Vietnam, Poland, Israel, Malaysia, Norway, Denmark, Finland, Pakistan | en-GB | the local language |

- **en-GB is not indexed in the US.** It is the secondary locale for most non-English storefronts, so an en-GB keyword field reaches far more stores than the US. [official](https://developer.apple.com/help/app-store-connect/reference/app-store-localizations) · 2026-11-19
- **Disputed** — UK: Apple lists no additional locale; practitioners report en-AU indexed. Mexico: Apple lists en-GB; a 2023 table doesn't. [practitioner](https://www.mobileaction.co/blog/app-store-cross-localization/) [practitioner](https://appfigures.com/resources/extend-keyword-list) · 2026-11-19
- Some real users see a secondary locale (e.g. es-MX in the US), so it must read as genuine copy. Keep the title and subtitle in that language and don't repeat the primary locale's terms. [official](https://developer.apple.com/help/app-store-connect/reference/app-store-localizations) [practitioner](https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store) · 2026-11-19
- Tags don't cross-localize: they come from en-US only. [official](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-tags) · 2026-11-19

## Google Play: languages, not countries

- Listings are per language (about 86). Without a translation Play shows a Google Translate version or the default language, with a notice. [official](https://support.google.com/googleplay/android-developer/answer/9844778) [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19
- Use custom store listings to give one country different copy. [official](https://support.google.com/googleplay/android-developer/answer/9844778) · 2026-11-19
- Professional translation of the description "can lead to better search results". [official](https://support.google.com/googleplay/android-developer/answer/4448378) · 2026-11-19
- Gemini listing translation (I/O 2026) is a starting point, not native keyword research. [practitioner](https://phiture.com/blog/aso-trends-in-2026/) · 2026-11-19
- The listing language follows `hl`, not `gl`. [probe](https://play.google.com/store/apps/details?id=com.duolingo&hl=de&gl=DE) · 2026-11-19

## Per-locale checks

1. Run the keyword method (`keyword-method.md`) again, using that locale's autocomplete and competitors.
2. iOS: the keyword field counts characters, so CJK fits about twice as many terms as English (`ios-metadata.md`). Check whether plurals rank separately.
3. Ban the local words for "free" and "best" (`limits.json` → `banned.locale`).
4. A native speaker reviews the copy before it ships. Without one, mark the locale `draft`.
