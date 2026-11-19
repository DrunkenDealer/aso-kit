---
name: quality-release
tags: [quality, release]
plugins: ["../.."]
runs: 3
max_turns: 60
timeout_seconds: 1200
allowed_tools: [Skill, Read, Write, Edit, Glob, Grep, Bash, Agent]
---

Write the store release notes for this release. Don't ask me anything — take the recommended default wherever you would ask.
