---
name: aso-context
description: Captures what every ASO step needs about an app into aso/context.md — what it is, who it's for, its main feature, the screens it has, target markets, competitors its own size, and the live App Store / Google Play listing and rating. Reads the repo first and asks only what the code can't answer. Triggers on "set up ASO for this app", "ASO context", "capture app context for ASO".
user-invocable: true
argument-hint: "[app store id | package name]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion
---

# ASO context

Writes `aso/context.md`. Paths, gates and the console format: `../aso/references/conventions.md`.

## 1. Read the repo

| Need | Read from |
|---|---|
| Name, description, value prop | `README.md`, `fastlane/metadata/**`, `Info.plist` (`CFBundleDisplayName`), `strings.xml` / `Localizable.xcstrings` (`app_name`), `package.json` |
| Store ids | `PRODUCT_BUNDLE_IDENTIFIER` in the Xcode project, `applicationId` in `build.gradle(.kts)`, App Store id in fastlane `Appfile`/`Deliverfile`, store links in the README |
| Current copy | `fastlane/metadata/<locale>/` (iOS: `name.txt`, `subtitle.txt`, `keywords.txt`…; Android: `fastlane/metadata/android/<locale>/title.txt`, `short_description.txt`, `full_description.txt`) |
| Shipped languages | `fastlane/metadata/*/`, `values-*/strings.xml`, `*.lproj`, `Localizable.xcstrings` |
| **Screens** | nav graph, routes, `NavHost`, `TabView`/`NavigationStack`, screen and page components, deep links |
| **Main feature** | the screen the app opens to, the README's first paragraph, the most code behind one feature |

Every screen gets one row: name, file or route, what it shows in a sentence. Skip debug, auth plumbing and dialogs.

## 2. Fetch the live listing

If the app is live, for each store and the primary storefront:

```
mkdir -p aso/snapshots
node ../aso/scripts/store.mjs lookup ios <id|bundleId> --cc us > aso/snapshots/ios-us.json
node ../aso/scripts/store.mjs lookup play <package> --cc us --lang en > aso/snapshots/play-us.json
```

A 404 or empty result means not live in that store — say so, don't guess. Keyword fields and promotional text are never public.

## 3. Ask what's left

One `AskUserQuestion` round, at most three questions, recommended default first. Typical gaps:

1. **Markets** — default: the languages the app already ships, primary first.
2. **Competitors** — offer 3–5 from `store.mjs search <store> "<core term>"`, chosen near the app's own size (ratings count within ~10×). Category giants rank on brand, not text; they teach nothing.
3. **Audience** — only if the README doesn't say.

## 4. Write `aso/context.md`

```markdown
> aso-context · all · YYYY-MM-DD

# <App>

**Positioning:** <App> is a <type> that helps <audience> <goal>.
**Main feature:** <one line>
**Audience:** <who, in their words>
**Stores:** App Store <id> · Google Play <package> (or "not live")
**Rating:** iOS 4.7 (1,204) · Play 4.4 (3,310) — below 4.0 is flagged

## Screens
| Screen | Where | Shows |

## Markets
| Locale | Storefront | Status |
| en-US | us | primary |

## Competitors
| App | Store ids | Ratings | Why a peer |

## Current copy
<per store: each field with its length, from the snapshot or fastlane; "—" if unknown>

## ASO state
- Context: YYYY-MM-DD
- Keywords: —
- Metadata: —
- Screenshot brief: —
- Audit: —
- Localized: —
- Release: —
```

On a re-run keep every state line except `Context`.

## Console

```
aso-context · en-US · <rating or "not live"> · <n> screens · <n> competitors
→ aso/context.md
```
