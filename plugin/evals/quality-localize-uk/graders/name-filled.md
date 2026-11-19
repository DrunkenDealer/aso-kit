---
type: regex
target: {source: file, path: aso/metadata.json}
pattern: "\"uk\"[\\s\\S]*?\"name\":\\s*\"[^\"]{25,30}\""
match: contains
---
