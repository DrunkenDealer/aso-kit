---
type: regex
target: {source: file, path: aso/metadata.json}
pattern: "\"de-DE\"[\\s\\S]*?\"name\":\\s*\"[^\"]{27,30}\""
match: contains
---
