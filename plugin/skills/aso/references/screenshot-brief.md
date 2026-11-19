# Screenshot brief

`aso/screenshot-brief.md` says **what the screenshots sell and say**; it never decides how they look. Whoever builds them — `/vitrine-deck`, a designer — has seen the real screens and owns layout, colour, device frames and sizes.

One brief per app, in the primary locale. Other locales are listed for translation, not written.

## Rules for the copy

From `knowledge/copy.md` § Screenshot captions and the stores' policies:

1. Headline 3–6 words, benefit-led: what the user gets, not what the screen is.
2. Subtitle optional, 6–12 words.
3. One idea per slide. Slides 1–3 each stand alone — search shows only those.
4. Echo a target keyword where it reads naturally; never rely on captions for ranking.
5. No price, offer, call to action, or the other store's name. No "Best", "#1", "Free" on any slide.
6. Awards, press quotes and ratings only on App Store slides, only if real.

## Format

```markdown
> aso-metadata · en-US · YYYY-MM-DD

# Screenshot brief — <App>

## Pitch
- **Main feature:** <the one thing the listing rests on>
- **Positioning:** <the description's first sentence>
- **Audience:** <who, in their words>
- **Keywords to echo:** <3–5 terms from the name, subtitle and short description>
- **Stores:** App Store (iPhone, iPad) · Google Play (phone)
- **Proof (App Store only):** <real award or rating, or —>

## Screens
| Screen | Where | Shows | Slide? |
|---|---|---|---|
| Today | `ui/today/TodayScreen.kt` | checklist of today's habits with streaks | yes — 1 |
| Settings | `ui/settings/` | toggles | no — nothing to sell |

## Slides
| # | Screen | Headline | Subtitle | Why here |
|---|---|---|---|---|
| 1 | Today | Build habits that stick | Check off your routine in one tap | the outcome, for search |
| 2 | Stats | See what's working | Weekly reviews show which habits last | proof it works |
| 3 | Widget | Your habits, on your home screen | — | what rivals lack |

## Demo data
<what the screens should show to look lived-in: names, counts, dates — or "real account">

## Other locales
<locales with metadata in `aso/metadata.json`; slides to translate, or "none">
```

5–8 slides. `Where` is a route, file or nav destination the builder can open; `—` if unknown. A screen that doesn't exist yet is not a slide.
