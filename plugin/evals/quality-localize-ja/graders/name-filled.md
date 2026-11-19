---
type: regex
target: {source: file, path: aso/metadata.json}
pattern: "\"ja\"[\\s\\S]*?\"name\":\\s*\"[^\"]{10,30}\""
match: contains
---
