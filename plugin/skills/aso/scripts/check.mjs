#!/usr/bin/env node
// Grades a metadata.json, or a keywords-<locale>.md plan, against store limits and policy in ../knowledge/limits.json.
//   node check.mjs <metadata.json | keywords-<locale>.md> [--json]
//   node check.mjs aso/ — line budgets of the md outputs, aso/changelog.md and aso/releases.md (conventions.md)
// Exit 0 clean or warnings only, 1 on any error, 2 on bad input.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const L = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../knowledge/limits.json"), "utf8"));
const [file, flag] = process.argv.slice(2);
if (!file) {
  console.error("usage: check.mjs <metadata.json | keywords-<locale>.md> [--json]");
  process.exit(2);
}
if (statSync(file).isDirectory()) {
  const BUDGET = { context: 50, keywords: 40, metadata: 60, audit: 50, "screenshot-brief": 50 };
  let over = 0;
  for (const f of readdirSync(file).filter((f) => f.endsWith(".md"))) {
    const max = BUDGET[f.replace(/-[a-z]{2}(-[A-Za-z]+)?\.md$|\.md$/, "")];
    const n = readFileSync(join(file, f), "utf8").trimEnd().split("\n").length;
    if (max && n > max) over++, console.log(`! ${f}: ${n}/${max} lines`);
  }
  if (!over) console.log("✓ every file within its line budget");
  const read = (name) => (existsSync(join(file, name)) ? readFileSync(join(file, name), "utf8") : null);
  const log = read("changelog.md"), rel = read("releases.md");
  process.exit(Math.max(log ? changelog(log) : 0, rel ? releases(rel) : 0));
}

function tableRows(md) {
  return md.split("\n").filter((l) => /^\|\s*\d/.test(l)).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
}

// aso/releases.md (conventions.md § Releases): row format, and commit ranges that chain.
function releases(md) {
  const rows = tableRows(md);
  let bad = 0, prev;
  for (const r of rows) {
    const [, from, to] = r[2]?.match(/^(—|[0-9a-f]{7,40})\.\.([0-9a-f]{7,40})$/) ?? [];
    const why =
      r.length !== 6 ? `${r.length} cells, want 6` :
      !/^\d{4}-\d{2}-\d{2}$/.test(r[0]) ? `date "${r[0]}"` :
      !to ? `commits "${r[2]}"` :
      !/^(ready|skipped|live \d{4}-\d{2}-\d{2})$/.test(r[5]) ? `status "${r[5]}"` :
      prev && !(from.startsWith(prev) || prev.startsWith(from)) ? `starts at ${from}, previous release ended at ${prev}` : null;
    if (why) bad++, console.log(`✗ releases.md ${r[0]} ${r[1] ?? ""}: ${why}`);
    prev = to;
  }
  if (!bad && rows.length) console.log(`✓ releases.md ${rows.length} rows`);
  return bad ? 1 : 0;
}

// aso/changelog.md (conventions.md § Changelog): row format, and locales built on an older primary.
function changelog(md) {
  const date = /^\d{4}-\d{2}-\d{2}$/;
  const rows = tableRows(md);
  let bad = 0;
  for (const r of rows) {
    const why =
      r.length !== 8 ? `${r.length} cells, want 8` :
      !date.test(r[0]) ? `date "${r[0]}"` :
      !/^(ready|dropped|live \d{4}-\d{2}-\d{2})$/.test(r[6]) ? `status "${r[6]}"` :
      r[5] !== "—" && !/^\S+ \d{4}-\d{2}-\d{2}$/.test(r[5]) ? `built on "${r[5]}"` : null;
    if (why) bad++, console.log(`✗ changelog.md ${r[0]} ${r[1] ?? ""}: ${why}`);
  }
  if (bad) return 1;
  const primary = rows[0]?.[1];
  const live = rows.filter((r) => r[1] === primary && r[6].startsWith("live")).map((r) => r[0]).sort().at(-1);
  const latest = new Map();
  for (const r of rows) if (r[1] !== primary && r[6] !== "dropped") latest.set(r[1], r[5].split(" ")[1]);
  for (const [locale, built] of latest)
    if (live && built < live) console.log(`! changelog.md ${locale}: built on ${primary} ${built}, ${primary} live since ${live} — stale`);
  if (rows.length) console.log(`✓ changelog.md ${rows.length} rows`);
  return 0;
}
const sibling = (name) => join(dirname(file), name);
const plan = file.endsWith(".md") ? readFileSync(file, "utf8") : null;
const metaFile = plan ? sibling("metadata.json") : file;
const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, "utf8")) : {};
const out = [];
const add = (level, locale, field, msg) => {
  if (!out.some((o) => o.locale === locale && o.field === field && o.msg === msg)) out.push({ level, locale, field, msg });
};

const chars = (s) => [...s].length;
const words = (s) => s.toLowerCase().normalize("NFC").match(/[\p{L}\p{N}]+/gu) ?? [];
// Whole-word or whole-phrase match; Unicode-aware so CJK and Cyrillic entries work.
const has = (text, term) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^\\p{L}\\p{N}])`, "iu").test(text);
const singular = (w) => w.replace(/(?<=[^aeiou])ies$/, "y").replace(/(?<=(s|x|z|ch|sh))es$/, "").replace(/(?<=[^s])s$/, "");

function limit(locale, store, field, value) {
  const spec = L[store][field];
  if (!spec || value == null) return;
  const n = chars(value);
  if (n > spec.max) add("error", locale, `${store}.${field}`, `${n}/${spec.max} ${spec.unit}`);
  if (spec.min && n < spec.min) add("error", locale, `${store}.${field}`, `shorter than ${spec.min}`);
  if (spec.fill && n < spec.max * spec.fill) add("warn", locale, `${store}.${field}`, `${n}/${spec.max} ${spec.unit} — indexed space left unused`);
}

// Events, IAPs, product pages, tags, promo content: arrays of items, each item's fields graded on their own.
function lists(locale, store, f, lang) {
  for (const [key, spec] of Object.entries(L.lists)) {
    const [s, name] = key.split(".");
    const items = f[name];
    if (s !== store || items == null) continue;
    if (spec.maxItems && items.length > spec.maxItems) add("error", locale, key, `${items.length} items, max ${spec.maxItems}`);
    items.forEach((item, i) => {
      for (const [field, fs] of Object.entries(spec.fields ?? { "": {} })) {
        const v = field ? item[field] : item;
        if (typeof v !== "string") continue;
        const at = `${key}[${i}]${field && `.${field}`}`;
        const n = chars(v);
        if (fs.max && n > fs.max) {
          const why = fs.disputed ? ` (Apple also states ${fs.disputed[1]}; the stricter limit is used)` : "";
          add(fs.source === "practitioner" ? "warn" : "error", locale, at, `${n}/${fs.max} chars${why}${fs.source ? ` — ${fs.source} figure` : ""}`);
        }
        if (store === "ios") banned(locale, at, v, L.banned.iosAll);
        common(locale, at, v, lang);
      }
    });
  }
}

function banned(locale, key, text, list) {
  for (const t of list) if (has(text, t)) add("error", locale, key, `banned "${t}"`);
}

function common(locale, key, text, lang) {
  for (const c of meta.competitors ?? []) if (has(text, c)) add("error", locale, key, `competitor name "${c}"`);
  banned(locale, key, text, L.banned.locale[lang] ?? []);
}

// Characters a 30-char indexed field can win back (length-and-packing.md § Packing guidance 1–2).
function spare(locale, key, text) {
  if (!text) return;
  if (/ [-–|] /.test(text)) add("warn", locale, key, `": " instead of a spaced dash or pipe saves a character`);
  if (/\band\b/i.test(text))
    add("warn", locale, key, `"&" instead of "and" saves 2 chars${key.startsWith("ios") ? " (iOS only partly matches them; keep \"and\" if the phrase is a target)" : ""}`);
}

function ios(locale, f, lang) {
  for (const k of Object.keys(L.ios)) limit(locale, "ios", k, f[k]);
  for (const [k, v] of Object.entries(f)) {
    if (typeof v !== "string") continue;
    banned(locale, `ios.${k}`, v, L.banned.iosAll);
    common(locale, `ios.${k}`, v, lang);
  }
  lists(locale, "ios", f, lang);
  const name = new Set(words(f.name ?? ""));
  const shared = words(f.subtitle ?? "").filter((w) => name.has(w) && w.length > 2);
  if (shared.length) add("warn", locale, "ios.subtitle", `repeats name words: ${[...new Set(shared)].join(", ")}`);
  if (lang === "en") for (const k of ["name", "subtitle"]) spare(locale, `ios.${k}`, f[k]);

  keywordField(locale, f, lang);
}

function keywordField(locale, f, lang) {
  const kw = f.keywords;
  if (kw == null) return;
  limit(locale, "ios", "keywords", kw);
  if (/,\s|\s,/.test(kw)) add("error", locale, "ios.keywords", "space next to a comma wastes budget");
  if (/^,|,$|,,/.test(kw)) add("error", locale, "ios.keywords", "empty term");
  if (/[^\p{L}\p{N}, ]/u.test(kw)) add("warn", locale, "ios.keywords", "special characters become spaces");
  const terms = kw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  const taken = new Set([...words(f.name ?? ""), ...words(f.subtitle ?? ""), ...words(meta.brand ?? ""), ...words(meta.developer ?? "")]);
  const seen = new Map();
  for (const t of terms) {
    if (chars(t) < L.ios.keywords.minTerm && !L.banned.iosKeywords.includes(t)) add("warn", locale, "ios.keywords", `"${t}" is ${chars(t)} chars; Apple wants more than 2`);
    if (L.banned.iosKeywords.includes(t)) add("error", locale, "ios.keywords", `wasted on "${t}"`);
    for (const w of words(t)) {
      if (taken.has(w)) add("error", locale, "ios.keywords", `"${w}" already in name, subtitle or developer name`);
      const base = lang === "en" ? singular(w) : w;
      if (seen.has(base) && seen.get(base) !== w) add("warn", locale, "ios.keywords", `"${[w, seen.get(base)].sort().join('" and "')}" are one word to Apple`);
      else if (seen.get(base) === w) add("error", locale, "ios.keywords", `"${w}" repeated`);
      seen.set(base, w);
    }
  }
  const used = chars(kw);
  if (used < L.ios.keywords.fillTarget) add("warn", locale, "ios.keywords", `${used}/100 chars — room for more terms`);
}

const section = (md, title) => md.split(/^## /m).find((x) => x.startsWith(title)) ?? "";
const rows = (sec) =>
  sec.split("\n").filter((l) => l.startsWith("|") && !/^\|[\s|:-]+\|$/.test(l)).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));

// The aso-keywords plan: targets need a source and no competitor names; the packed field obeys the same rules as in metadata.json.
function keywordPlan(locale, md, lang) {
  meta.competitors ??= existsSync(sibling("context.md")) ? rows(section(readFileSync(sibling("context.md"), "utf8"), "Competitors")).slice(1).map((r) => r[0]) : [];
  const [head, ...targets] = rows(section(md, "Targets"));
  const src = head?.findIndex((c) => /^source$/i.test(c)) ?? -1;
  for (const t of targets) {
    if (src < 0 || !t[src]) add("error", locale, "keywords.targets", `"${t[0]}" has no source`);
    for (const c of meta.competitors) if (has(t[0], c)) add("error", locale, "keywords.targets", `competitor name "${c}" as a target`);
  }
  if (targets.length < 15) add("warn", locale, "keywords.targets", `${targets.length} targets; aim for 15–20`);

  const placement = section(md, "Placement");
  const name = placement.match(/\*\*iOS name:\*\*\s*([^·\n]*)/)?.[1].trim();
  const subtitle = placement.match(/\*\*subtitle:\*\*\s*([^·\n]*)/)?.[1].trim();
  const field = section(md, "iOS keyword field").match(/`([^`]*)`/)?.[1];
  if (field == null) add("error", locale, "keywords.field", "no packed iOS keyword field");
  keywordField(locale, { name, subtitle, keywords: field }, lang);

  const live = meta.locales?.[locale];
  if (live?.ios?.keywords != null && field != null && live.ios.keywords !== field)
    add("warn", locale, "ios.keywords", `metadata.json differs from the field packed in keywords-${locale}.md`);
  const headTerm = md.match(/\*\*Head term:\*\*\s*([^·\n]*)/)?.[1].trim();
  for (const [k, v] of [["ios.name", live?.ios?.name], ["play.title", live?.play?.title]])
    if (headTerm && v != null && !has(v, headTerm)) add("warn", locale, k, `head term "${headTerm}" planned here but missing`);
}

function play(locale, f, lang, primary) {
  for (const k of Object.keys(L.play)) limit(locale, "play", k, f[k]);
  const re = (p) => new RegExp(p, "gu");
  for (const k of ["title", "shortDescription"]) {
    const v = f[k];
    if (v == null) continue;
    banned(locale, `play.${k}`, v, k === "title" ? L.banned.playTitle : L.banned.playShort);
    if (re(L.patterns.emoji).test(v)) add("error", locale, `play.${k}`, "emoji");
    if (re(L.patterns.repeatedPunctuation).test(v)) add("error", locale, `play.${k}`, "repeated punctuation");
    const caps = (v.match(re(L.patterns.allCapsWord)) ?? []).filter((w) => !has(meta.brand ?? "", w));
    if (caps.length) add("warn", locale, `play.${k}`, `ALL CAPS: ${caps.join(", ")}`);
  }
  for (const [k, v] of Object.entries(f)) if (typeof v === "string") common(locale, `play.${k}`, v, lang);
  if (lang === "en") spare(locale, "play.title", f.title);
  lists(locale, "play", f, lang);

  const full = f.fullDescription;
  if (full == null) return;
  banned(locale, "play.fullDescription", full, L.banned.playFull);
  if (f.shortDescription && full.toLowerCase().includes(f.shortDescription.toLowerCase().trim()))
    add("error", locale, "play.fullDescription", "repeats the short description");
  for (const line of full.split("\n"))
    if (line.split(",").length >= 6 && line.split(",").every((p) => words(p).length <= 3))
      add("error", locale, "play.fullDescription", `keyword list: "${line.slice(0, 50)}…"`);
  if (!primary) return;
  const all = words(full);
  const pw = words(primary);
  let hits = 0;
  for (let i = 0; i + pw.length <= all.length; i++) if (pw.every((w, j) => all[i + j] === w)) hits++;
  const [lo, hi] = L.play.fullDescription.primaryMentions;
  if (hits < lo || hits > hi) add("warn", locale, "play.fullDescription", `"${primary}" ${hits}× (aim ${lo}–${hi})`);
  // Density only means something on a full-length text; short ones are judged by the mention count.
  const density = hits / Math.max(all.length, 1);
  if (hits > hi && density > L.play.fullDescription.maxDensity) add("error", locale, "play.fullDescription", `"${primary}" density ${(density * 100).toFixed(1)}% reads as stuffing`);
  const opening = words(full.split(/(?<=[.!?])\s/).slice(0, 3).join(" ")).join(" ");
  if (!opening.includes(pw.join(" "))) add("warn", locale, "play.fullDescription", `"${primary}" not in the first three sentences`);
}

if (plan) {
  const locale = file.match(/keywords-(.+)\.md$/)?.[1] ?? "?";
  keywordPlan(locale, plan, locale.split("-")[0].toLowerCase());
} else for (const [locale, entry] of Object.entries(meta.locales ?? {})) {
  const lang = locale.split("-")[0].toLowerCase();
  if (entry.ios) ios(locale, entry.ios, lang);
  if (entry.play) play(locale, entry.play, lang, entry.primaryKeyword);
}

if (flag === "--json") console.log(JSON.stringify(out, null, 2));
else if (!out.length) console.log("✓ all checks pass");
else for (const o of out) console.log(`${o.level === "error" ? "✗" : "!"} ${o.locale} ${o.field}: ${o.msg}`);
process.exit(out.some((o) => o.level === "error") ? 1 : 0);
