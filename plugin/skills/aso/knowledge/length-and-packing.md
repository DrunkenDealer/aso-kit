# Length and packing

Every indexed character counts, and every locale has to fit the same limits in its own words. This file holds what each character buys: what the stores fold together, what they index for free, and how much text grows in translation.

`probe` bullets are our own `aso-kit store match` runs. They show how much the top 25 results of two queries overlap (≥ 0.7 same, ≤ 0.3 different). On iOS the probe uses the iTunes Search API, which only approximates in-app search.

## Budgets

- The iOS keyword field is enforced in characters: among 5,304 live fields, 1,339 exceed 100 bytes and none exceeds 100 characters (Japanese reaches 262 bytes). [data](https://appdrift.co/blog/aso-localization) · 2026-11-19
- A full keyword field holds about 12 terms in English, 22 in Japanese, 26 in Korean, 27 in Simplified and 29 in Traditional Chinese. [data](https://appdrift.co/blog/aso-localization) · 2026-11-19
- Each keyword must be "greater than two characters", so two-letter tokens (ai, 3d, tv) in the keyword field may be ignored. [official](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) · 2026-11-19
- German subtitles fill 28+ of 30 characters 86% of the time (English 82%), the tightest of the measured languages. [data](https://appdrift.co/blog/aso-localization) · 2026-11-19
- Play counts full-width and half-width characters the same. [official](https://support.google.com/googleplay/android-developer/answer/9859152) · 2026-11-19

## Separators and punctuation

- Apple: special characters "don't carry extra weight when users search for your app". [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Play: no "repeated special characters", and no special characters "to manipulate search ranking". [official](https://support.google.com/googleplay/android-developer/answer/9898842) · 2026-11-19
- `: ` costs 2 characters, ` - `, ` – ` and ` | ` cost 3; among 1M+ install Play titles the colon is slightly more common (20.65%) than the dash (17.12%). [practitioner](https://appdrift.co/blog/app-store-title-optimization) · 2026-11-19
- "to-do list" vs "to do list": Play 1.0 (same), iOS 0.62 (partial); vs "todo list": Play 0.76, iOS 0.57. [probe](https://play.google.com/store/search?q=to-do%20list&c=apps&gl=US) [probe](https://itunes.apple.com/search?term=to-do%20list&country=us&entity=software) · 2026-11-19
- "notes & reminders" vs "notes and reminders": Play 0.80 (same), iOS 0.36 (partial). [probe](https://play.google.com/store/search?q=notes%20%26%20reminders&c=apps&gl=US) [probe](https://itunes.apple.com/search?term=notes%20%26%20reminders&country=us&entity=software) · 2026-11-19
- "3d scanner" vs "three d scanner": Play 0.76 (same), iOS 0.46 (partial). [probe](https://play.google.com/store/search?q=3d%20scanner&c=apps&gl=US) [probe](https://itunes.apple.com/search?term=3d%20scanner&country=us&entity=software) · 2026-11-19

## Indexed for free (iOS)

- "Your app is searchable by app name and company name, so you shouldn't duplicate these values in the keyword list." [official](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) · 2026-11-19
- Primary and secondary category are indexed; don't repeat words from the name, subtitle or category, or the word "app". [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- Custom product pages take keywords only from the latest approved version, so they add no new indexed terms. [official](https://developer.apple.com/help/app-store-connect/create-custom-product-pages/configure-multiple-product-page-versions/) · 2026-11-19
- Keywords are not combined across localizations: "bus" in en-US and "metro" in es-MX rank for each word, likely not for "metro bus". [practitioner](https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store) · 2026-11-19
- Play: developer name helps users "find" the app; Google doesn't say it is indexed. [official](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en) · 2026-11-19

## What the stores fold together

- Apple treats plurals of words already in the field as duplicates ("climbs" and "climb"). [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- **Disputed** — matched is not ranked equally: across 100 singular/plural pairs only 4.4 of the top 10 apps overlap on iOS, 5.6 on Play. [data](https://www.apptweak.com/en/aso-blog/do-singular-or-plural-keywords-rank-differently-in-aso) · 2026-11-19
- Plurals in de, es, ru, pl overlap 0.45–0.56 on both stores (partial); "habit tracker(s)" 0.57 iOS, 0.65 Play. [probe](https://itunes.apple.com/search?term=rezepte&country=de&entity=software) [probe](https://play.google.com/store/search?q=rezepte&c=apps&gl=DE) · 2026-11-19
- Dropped accents mostly fold: ćwiczenia/cwiczenia 0.88–0.96, übung/ubung 1.0 on both stores; café/cafe 0.88 on Play, 0.61 on iOS. [probe](https://itunes.apple.com/search?term=%C3%BCbung&country=de&entity=software) [probe](https://play.google.com/store/search?q=caf%C3%A9&c=apps&gl=FR) · 2026-11-19
- übung vs "uebung" is a different query on both stores (0 iOS, 0.22 Play). [probe](https://itunes.apple.com/search?term=uebung&country=de&entity=software) [probe](https://play.google.com/store/search?q=uebung&c=apps&gl=DE) · 2026-11-19
- German and Dutch compounds vs split forms: 0.52–1.0, never different (kalorienzähler 0.85 iOS, 1.0 Play; fitnesstracker 0.52 iOS, 0.64 Play). [probe](https://itunes.apple.com/search?term=fitnesstracker&country=de&entity=software) [probe](https://play.google.com/store/search?q=fitnesstracker&c=apps&gl=DE) · 2026-11-19
- Japanese kanji and hiragana fold on both stores (家計簿/かけいぼ 1.0 iOS, 0.84 Play); romaji "kakeibo" is different on Play (0.2), partial on iOS (0.52). [probe](https://play.google.com/store/search?q=kakeibo&c=apps&gl=JP) [probe](https://itunes.apple.com/search?term=kakeibo&country=jp&entity=software) · 2026-11-19
- Play keyword bundles include "spelling corrections and translations" of a query. [official](https://support.google.com/googleplay/android-developer/answer/9867158) · 2026-11-19
- Google: "Avoid using subtle misspellings of general terms, as users may end up correcting misspelled search terms." [official](https://support.google.com/googleplay/android-developer/answer/4448378?hl=en) · 2026-11-19
- Misspellings return the correct query's results on Play (calender, reciept, meditaion: 1.0) and only partly on iOS (0.41–0.68). [probe](https://play.google.com/store/search?q=calender&c=apps&gl=US) [probe](https://itunes.apple.com/search?term=calender&country=us&entity=software) · 2026-11-19

## Expansion from English

- Average growth by source length: up to 10 chars 200–300%, 11–20 chars 180–200%, 21–30 chars 160–180%, 31–50 chars 140–160%, over 70 chars 130%. [practitioner](https://www.w3.org/International/articles/article-text-size/index.en) · 2026-11-19
- Per language: German +10–35%, French +15–20%, Spanish +15–30%, Italian +10–25%, Portuguese +15–30%, Russian +15%, Polish +20–30%, Japanese −10 to −55%, Korean −10 to −15%. [practitioner](https://www.andiamo.co.uk/resources/expansion-and-contraction-factors/) · 2026-11-19
- Store descriptions written to fit, median length vs English: es-ES 1.09, es-MX 1.14, fr-FR 1.13, fr-CA 1.31, de 0.97, pt-BR 1.09, ar 0.83, ja 0.51, ko 0.55, zh-Hans 0.50, zh-Hant 0.38. [data](https://appdrift.co/blog/aso-localization) · 2026-11-19

## Packing guidance

No source shows the separator choice affecting rank, and nothing settles whether ü/ue, ё/е or Chinese and Korean segmentation fold in in-app search. Derived from the facts above; `aso-kit check` enforces the countable ones.

1. **Separators.** `Brand: Phrase` costs 2, `Brand - Phrase` 3. Use the colon unless the brand already reads with a dash.
2. **"&" for "and".** Saves 2 characters. Play matches the two; iOS only partly. On iOS keep "and" when "x and y" is itself a target query, otherwise use "&".
3. **Keyword field.** Commas, no spaces, single words. Leave out what is indexed for free: name, subtitle, developer name, category words, "app", and in English the plural of a word already in.
4. **Plurals outside English.** Both stores treat singular and plural as different queries. Put the form autocomplete suggests in name or subtitle and the other form in the keyword field if there is room.
5. **Accents.** Write the correctly accented form; dropped accents mostly fold. Transliterations do not (ue for ü, romaji for kana): add one only when autocomplete shows it.
6. **Compounds.** German and Dutch compounds partly match their split form. Use the compound in the name and add the head noun alone in the keyword field.
7. **Digits.** On Play digits and number words mostly match, so use digits. On iOS use the form autocomplete shows.
8. **Misspellings.** Never on Play. On iOS only in the keyword field, and only when autocomplete shows the misspelling.
9. **CJK.** A character costs 1 in the keyword field. Separate terms with ASCII commas.
10. **Translations don't fit.** A 30-character English name grows 60–80% in most European languages. Write each locale fresh from its own keyword plan to its own limit, and choose the locale's shorter search term when two mean the same.
