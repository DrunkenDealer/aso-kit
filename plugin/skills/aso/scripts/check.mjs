#!/usr/bin/env node
// Grades a metadata.json against store limits and policy in ../knowledge/limits.json.
//   node check.mjs <metadata.json> [--json]
// Exit 0 clean or warnings only, 1 on any error, 2 on bad input.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const L = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../knowledge/limits.json"), "utf8"));
const [file, flag] = process.argv.slice(2);
if (!file) {
  console.error("usage: check.mjs <metadata.json> [--json]");
  process.exit(2);
}
const meta = JSON.parse(readFileSync(file, "utf8"));
const out = [];
const add = (level, locale, field, msg) => {
  if (!out.some((o) => o.locale === locale && o.field === field && o.msg === msg)) out.push({ level, locale, field, msg });
};

const chars = (s) => [...s].length;
const bytes = (s) => Buffer.byteLength(s, "utf8");
const words = (s) => s.toLowerCase().normalize("NFC").match(/[\p{L}\p{N}]+/gu) ?? [];
// Whole-word or whole-phrase match; Unicode-aware so CJK and Cyrillic entries work.
const has = (text, term) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^\\p{L}\\p{N}])`, "iu").test(text);
const singular = (w) => w.replace(/(?<=[^aeiou])ies$/, "y").replace(/(?<=(s|x|z|ch|sh))es$/, "").replace(/(?<=[^s])s$/, "");

function limit(locale, store, field, value) {
  const spec = L[store][field];
  if (!spec || value == null) return;
  const n = spec.unit === "bytes" ? bytes(value) : chars(value);
  if (n > spec.max) add("error", locale, `${store}.${field}`, `${n}/${spec.max} ${spec.unit}`);
  if (spec.min && n < spec.min) add("error", locale, `${store}.${field}`, `shorter than ${spec.min}`);
}

function banned(locale, key, text, list) {
  for (const t of list) if (has(text, t)) add("error", locale, key, `banned "${t}"`);
}

function common(locale, key, text, lang) {
  for (const c of meta.competitors ?? []) if (has(text, c)) add("error", locale, key, `competitor name "${c}"`);
  banned(locale, key, text, L.banned.locale[lang] ?? []);
}

function ios(locale, f, lang) {
  for (const k of Object.keys(L.ios)) limit(locale, "ios", k, f[k]);
  for (const [k, v] of Object.entries(f)) {
    if (typeof v !== "string") continue;
    banned(locale, `ios.${k}`, v, L.banned.iosAll);
    common(locale, `ios.${k}`, v, lang);
  }
  const name = new Set(words(f.name ?? ""));
  const shared = words(f.subtitle ?? "").filter((w) => name.has(w) && w.length > 2);
  if (shared.length) add("warn", locale, "ios.subtitle", `repeats name words: ${[...new Set(shared)].join(", ")}`);

  const kw = f.keywords;
  if (kw == null) return;
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
  const used = bytes(kw);
  if (used < L.ios.keywords.fillTarget) add("warn", locale, "ios.keywords", `${used}/100 bytes — room for more terms`);
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

for (const [locale, entry] of Object.entries(meta.locales ?? {})) {
  const lang = locale.split("-")[0].toLowerCase();
  if (entry.ios) ios(locale, entry.ios, lang);
  if (entry.play) play(locale, entry.play, lang, entry.primaryKeyword);
}

if (flag === "--json") console.log(JSON.stringify(out, null, 2));
else if (!out.length) console.log("✓ all checks pass");
else for (const o of out) console.log(`${o.level === "error" ? "✗" : "!"} ${o.locale} ${o.field}: ${o.msg}`);
process.exit(out.some((o) => o.level === "error") ? 1 : 0);
