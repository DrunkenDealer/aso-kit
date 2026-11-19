---
type: llm
focus: {source: file, path: aso/audit.md}
---
Grade this audit of a deliberately weak draft listing. Pass only if it flags each of these, with a concrete fix:
1. The iOS name "Habitly" leaves most of its 30 characters unused.
2. The subtitle repeats the name's words (Habitly, habit) and wastes characters on "App".
3. The iOS keyword field has spaces after commas, banned or wasted words (best, app), a competitor name (Streaks), and words already in the name.
4. The Play short description uses "best", repeated punctuation and a call to action ("Download now"), and the full description repeats it and reads as a keyword list.
Further findings are fine when they are true of the draft; fail only for a problem the draft doesn't have.
