---
type: regex
target: {source: file, path: aso/metadata.json}
pattern: "\"ar-SA\"[\\s\\S]*?\"name\":\\s*\"[^\"]{18,30}\""
match: contains
---
