---
type: regex
target: {source: file, path: aso/metadata.json}
pattern: "\"name\":\\s*\"[^\"]{27,30}\""
match: contains
---
