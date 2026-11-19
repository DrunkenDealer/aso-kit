#!/usr/bin/env node
// Lints the knowledge base: every fact bullet carries typed evidence and a verified date, no fact is
// older than MAX_AGE days, limits.json agrees with the field tables, and files the README lists exist.
//   node scripts/drift.mjs [--max-age 180]
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const kb = join(dirname(fileURLToPath(import.meta.url)), "../knowledge");
const ageArg = process.argv.indexOf("--max-age");
const maxAge = ageArg > 0 ? Number(process.argv[ageArg + 1]) : 180;
const TAGS = new Set(["official", "data", "practitioner", "probe"]);
const problems = [];
const today = Date.now();

for (const f of readdirSync(kb).filter((f) => f.endsWith(".md") && f !== "README.md")) {
  readFileSync(join(kb, f), "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (!line.startsWith("- ")) return;
      const at = `${f}:${i + 1}`;
      const ev = [...line.matchAll(/\[(\w+)\]\((https?:\/\/[^)\s]+)\)/g)];
      if (!ev.length) return problems.push(`${at} no evidence link`);
      for (const [, tag] of ev) if (!TAGS.has(tag)) problems.push(`${at} unknown evidence tag "${tag}"`);
      const date = line.match(/ · (\d{4}-\d{2}-\d{2})$/)?.[1];
      if (!date) return problems.push(`${at} no verified date at end of line`);
      const days = (today - Date.parse(date)) / 864e5;
      if (days > maxAge) problems.push(`${at} verified ${date}, ${Math.floor(days)} days ago`);
      if (f !== "myths.md" && /\b(rule|must|always|never)\b/i.test(line) && ev.every(([, t]) => t === "practitioner") && !line.includes("**Disputed**"))
        problems.push(`${at} practitioner-only evidence worded as a rule`);
    });
}

const limits = JSON.parse(readFileSync(join(kb, "limits.json"), "utf8"));
const rowLimit = (file, label) => {
  const row = readFileSync(join(kb, file), "utf8").split("\n").find((l) => l.startsWith(`| ${label} |`));
  return row && Number(row.split("|")[2].trim().match(/(\d+)\s*(?:chars|\(|$)/)?.[1]);
};
for (const [file, label, value] of [
  ["ios-metadata.md", "App name", limits.ios.name.max],
  ["ios-metadata.md", "Subtitle", limits.ios.subtitle.max],
  ["ios-metadata.md", "Keyword field", limits.ios.keywords.max],
  ["ios-metadata.md", "Promotional text", limits.ios.promotionalText.max],
  ["ios-metadata.md", "Description", limits.ios.description.max],
  ["ios-metadata.md", "What's New", limits.ios.whatsNew.max],
  ["ios-metadata.md", "In-App Event name / short / long", limits.lists["ios.events"].fields.long.max],
  ["ios-metadata.md", "In-App Purchase display name / description", limits.lists["ios.iaps"].fields.description.max],
  ["ios-metadata.md", "Custom product page promotional text", limits.lists["ios.customProductPages"].fields.promotionalText.max],
  ["play-metadata.md", "App name (title)", limits.play.title.max],
  ["play-metadata.md", 'Short description ("Promotional description")', limits.play.shortDescription.max],
  ["play-metadata.md", "Full description", limits.play.fullDescription.max],
  ["play-metadata.md", "Release notes", limits.play.releaseNotes.max],
  ["play-metadata.md", "Tags", limits.lists["play.tags"].maxItems],
]) {
  const table = rowLimit(file, label);
  if (table !== value) problems.push(`${file} "${label}" table says ${table}, limits.json says ${value}`);
}

for (const [, name] of readFileSync(join(kb, "README.md"), "utf8").matchAll(/^\| `([\w.-]+)` \|/gm))
  if (!existsSync(join(kb, name))) problems.push(`README.md lists missing ${name}`);

for (const p of problems) console.log(`✗ ${p}`);
console.log(problems.length ? `${problems.length} problem(s)` : "✓ knowledge base clean");
process.exit(problems.length ? 1 : 0);
