---
name: quality-audit
tags: [quality]
plugins: ["../.."]
runs: 3
max_turns: 80
timeout_seconds: 1500
allowed_tools: [Skill, Read, Write, Edit, Glob, Grep, Bash, Agent]
---

Audit my draft store listing in aso/metadata.json. The app isn't live yet.
