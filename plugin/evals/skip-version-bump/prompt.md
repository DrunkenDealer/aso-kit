---
name: skip-version-bump
tags: [trigger]
plugins: ["../.."]
runs: 3
max_turns: 3
allowed_tools: [Skill, Read, Glob]
---

Bump the app version to 2.4.0 in build.gradle.kts and Info.plist.
