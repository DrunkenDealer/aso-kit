---
type: regex
target: {source: file, path: aso/metadata.json}
pattern: "\"hi\"[\\s\\S]*?\"name\":\\s*\"[^\"]{18,30}\""
match: contains
---
