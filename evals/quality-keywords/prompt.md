---
name: quality-keywords
tags: [quality]
plugins: ["../.."]
runs: 3
max_turns: 80
timeout_seconds: 1500
allowed_tools: [Skill, Read, Write, Edit, Glob, Grep, Bash, Agent]
---

Do the en-US keyword research for this app's App Store and Google Play listing. Don't ask me anything — take the recommended default wherever you would ask.
