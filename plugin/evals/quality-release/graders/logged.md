---
type: regex
target: {source: file, path: aso/releases.md}
pattern: "\\| 1\\.1\\.0 \\| [0-9a-f]{7,40}\\.\\.[0-9a-f]{7,40} \\|[^\\n]*\\| ready \\|"
match: contains
---
