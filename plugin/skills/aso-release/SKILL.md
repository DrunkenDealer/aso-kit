---
name: aso-release
description: Writes the release notes for one app release from the git changes since the last one — App Store What's New and Google Play release notes (in Play Console's <lang> tag format) for every live locale — graded against store limits and policy, and recorded in aso/releases.md. Proposes new App Store promotional text only when the release has a headline feature, and says whether the listing itself needs attention. Never edits listing copy. Triggers on "write release notes", "What's New for this release", "Play Console release notes", "changelog for the store", "aso release".
user-invocable: true
argument-hint: "[<from>..<to> | since <date>] [--fastlane]"
allowed-tools: Read, Glob, Grep
---

# ASO release

Writes `aso/release.md`, appends a row to `aso/releases.md`, and updates `whatsNew` / `releaseNotes` in `aso/metadata.json`. Paths, formats, console: `../aso/references/conventions.md`. Rules: `../aso/knowledge/copy.md` § What's New, `../aso/knowledge/policy.md` (2.3.12).

Release notes aren't ranked on either store, so this runs every release, needs no measuring window, and other locales may be translated from the primary's notes — unlike listing copy.

## 1. Range

The first that applies:

1. The argument: `<from>..<to>`, or `since <date>`.
2. The last row of `aso/releases.md`: from its `to` commit to `HEAD`.
3. The last release tag: `git describe --tags --abbrev=0` to `HEAD`.
4. The live iOS version: `aso-kit store lookup ios <id>` gives `version` and `updated` (its release date); commits since that date.

None applies, or the range holds more than 100 commits → one `AskUserQuestion`: **Since a date** · **Last N commits** · **I'll describe the changes**.

Version: the argument, the newest tag in the range, or the app's version file (`Info.plist`, `build.gradle(.kts)`, `pubspec.yaml`, `package.json`); `—` if none.

## 2. User-facing changes

`git log --format='%h %s' <range>`. With conventional commits, `feat` and `fix` are candidates and `chore`, `test`, `ci`, `refactor`, `docs`, `build`, `style` are not. Otherwise spawn a `haiku` agent with the subjects and `git log --stat` paths: UI and feature code are candidates, build, CI and tests are not, and anything it can't place is **unsure**.

A candidate is in the notes if a user would notice it. Name features as `aso/metadata.json` and `aso/context.md` name them. Unsure items go to the user in one multi-select `AskUserQuestion`; without one (headless), they stay out and are listed in the md.

No user-facing change → status `skipped`, notes "Bug fixes and improvements." only if the store requires notes (iOS after v1; 2.3.12 allows generic notes for bug-fix-only releases).

## 3. Write

Primary locale (`en-US` unless the app has no English listing) first:

- Most important change first; one line each; specific — what the user can now do, not what was refactored.
- A closing line inviting feedback or a review is fine; "download", "update now" and banned words aren't (`aso-kit check`).
- Play: ≤ 500 characters per language. iOS: ≤ 4000, but keep it the Play length — same text on both stores unless a change is platform-only.

Then each other locale in `aso/metadata.json`: the same notes in that language, same order, same claims. Platform-only changes go only to that store.

Write them into `aso/metadata.json` (`ios.whatsNew`, `play.releaseNotes`) and run `aso-kit check aso/metadata.json`; fix errors in the notes only — errors in other fields are for `/aso-audit`.

## 4. Promotional text (iOS)

Not tied to releases; no ranking effect; moves conversion. Propose a new line (≤ 170) only if the release has a headline feature; otherwise "keep". Applying it is a listing change: on yes, append a `promotionalText` row to `aso/changelog.md`.

## 5. Listing verdict

Read `aso/changelog.md` and the notes:

- A feature the listing copy names was removed or renamed → "copy claims <x>: run `/aso-metadata`" — the only reason to touch copy mid-window.
- A changelog row past its window with no Result → "window ended for <field>: run `/aso-audit`".
- Otherwise "no change", with the date the current window ends if one is open.

Never edit listing copy here.

## 6. Record

`aso/release.md`:

````markdown
> aso-release · all · YYYY-MM-DD · <version> · <from>..<to> · check clean

# Release — <version>

## Changes
| Commit | Kind | In notes |

## App Store — What's New
**<locale>**
<notes>

## Google Play — release notes
```
<en-US>
<notes>
</en-US>
```

## Promotional text (iOS)
| Locale | Current | Proposed |

## Listing
<verdict>
````

The Play block is pasted as is into Play Console → release → Release notes. Its tags are Play language codes: `en-US`, `de-DE`, `uk`, `ja-JP`, `hi-IN`, `ar` — the `fastlane/metadata/android/<code>` folder name when one exists.

Append to `aso/releases.md` (create it with the header from `conventions.md`): date, version, `<from>..<to>` as short hashes (`from` is `—` when the range starts at the first commit), the locales, the primary's iOS notes on one line, status `ready` or `skipped`. If the previous row is still `ready` and that version is live (a newer tag, or the store's version), set it `live <date>` first.

`--fastlane`, or a yes to "Write the notes to fastlane?" when `fastlane/metadata/` exists: `fastlane/metadata/<locale>/release_notes.txt` and `fastlane/metadata/android/<code>/changelogs/default.txt`. Headless without the flag: don't write them.

Run `aso-kit check aso/` and fix what it flags. Update the state line `Release`.

## Console

```
aso-release · <version> · <n> commits since <anchor> · <n> user-facing, <n> unsure
  iOS What's New   <locale> <n>/4000 · …
  Play notes       <locale> <n>/500 · …
  Promo text       <keep | new line proposed (<feature>)>
  Listing          <verdict>
→ aso/release.md · aso/releases.md
```
