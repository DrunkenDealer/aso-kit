# Copy rubric

What `aso-kit check` can't count. The `aso-verifier` agent answers each item PASS, FAIL or N/A for one locale, quoting the line that decides it. Knowledge files are in `../knowledge/`.

| # | Item | PASS when | Rule |
|---|---|---|---|
| 1 | Plan applied | The name/title carry the head term and the subtitle/short description the second cluster, as `keywords-<locale>.md` placed them; the iOS keyword field is the packed one or a reserve swap | `keyword-method.md` § 4 |
| 2 | True claims | Every feature, number and award in the copy appears in `context.md` (screens, main feature) or the repo | `policy.md` § Both stores 2 |
| 3 | Name reads as a name | `Brand: Phrase` or `Phrase - Brand`, one keyword theme, not a list of terms | `copy.md` § Name / title 1–2 |
| 4 | Benefit first | Subtitle and short description state what the user gets, front-loaded, not a list of features or keywords | `copy.md` § iOS subtitle, § Play short description |
| 5 | Natural description | The Play full description reads as sentences for a person: positioning sentence first, the head term placed where it fits, no repeated phrase that only a search engine would want | `copy.md` § Description |
| 6 | Native language | The copy reads as written in the locale's language, with its own search words from the keywords file, not translated English | `localization.md` |
| 7 | Policy tone | No superlative, ranking, price, CTA, other store or platform, and no claim the app can't prove, including ones the banned lists miss (paraphrases, other languages) | `policy.md` |
| 8 | One story | Feature names are the same in description, promotional text, What's New and the screenshot brief; the brief's headlines echo this locale's targets | `copy.md` § Screenshot captions |
| 9 | Specific notes | What's New / release notes name real changes, unless the release is fixes only | `copy.md` § What's New |
| 10 | Cross-localization | A secondary App Store locale reads as real copy in its language and repeats no word from the primary locale's name, subtitle or keyword field | `localization.md` § App Store |

Item 10 is N/A unless the locale is planned as a secondary slot. Items 8 and 9 are N/A for fields that don't exist yet.

## Locale vs primary

Only for a locale other than the primary one. The words differ on purpose (each locale has its own keyword plan); the meaning must not. Back-translate the name, subtitle, short description and the positioning sentence into plain English first, then compare with the primary locale's copy.

| # | Item | PASS when | Rule |
|---|---|---|---|
| 11 | Same promise | The positioning sentence back-translates to the same app type, audience and goal as the primary's | `copy.md` § Description 1 |
| 12 | Same claims | No feature, number or promise the primary doesn't make, and none of the primary's top three features missing | `policy.md` § Both stores 2–3 |
| 13 | Own words, same sense | Name and subtitle carry this locale's targets from `keywords-<locale>.md`, and each back-translation is still true of the app; a literal translation of the primary's head term passes only if the keyword plan chose it | `localization.md` |
| 14 | Same voice | Register and form of address fit the market (du/Sie, tu/vous, keigo) and match the primary's tone | `localization.md` |
