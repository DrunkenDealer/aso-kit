// node --test evals/
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const run = (fixture) => {
  const r = spawnSync("node", [join(here, "../plugin/skills/aso/scripts/check.mjs"), join(here, "fixtures", fixture), "--json"], { encoding: "utf8" });
  return { code: r.status, findings: JSON.parse(r.stdout) };
};
const msgs = (findings) => findings.map((f) => `${f.level} ${f.locale} ${f.field}: ${f.msg}`);

test("a clean listing passes", () => {
  const { code, findings } = run("good.json");
  assert.equal(code, 0);
  assert.deepEqual(findings, []);
});

test("a stuffed listing fails on every rule it breaks", () => {
  const { code, findings } = run("bad.json");
  assert.equal(code, 1);
  const m = msgs(findings);
  for (const want of [
    "error en-US ios.name: 50/30 chars",
    'warn en-US ios.name: "&" instead of "and" saves 2 chars (iOS only partly matches them; keep "and" if the phrase is a target)',
    'warn en-US play.title: ": " instead of a spaced dash or pipe saves a character',
    'error en-US ios.name: banned "android"',
    "error en-US ios.keywords: space next to a comma wastes budget",
    'error en-US ios.keywords: "habit" already in name, subtitle or developer name',
    'error en-US ios.keywords: wasted on "app"',
    'error en-US ios.keywords: competitor name "Streaks"',
    'warn en-US ios.keywords: "streak" and "streaks" are one word to Apple',
    'error en-US play.title: banned "#1"',
    "error en-US play.title: emoji",
    'error en-US play.shortDescription: banned "download now"',
    "error en-US play.shortDescription: repeated punctuation",
    "error en-US play.fullDescription: repeats the short description",
    'error de-DE ios.subtitle: banned "kostenlos"',
    "warn de-DE ios.name: 7/30 chars — indexed space left unused",
    "error en-US ios.events[0].name: 35/30 chars",
    "error en-US ios.iaps[0].name: 31/30 chars (Apple also states 35; the stricter limit is used)",
    "error en-US play.tags: 6 items, max 5",
    'error en-US play.promotionalContent[0].title: competitor name "Streaks"',
  ])
    assert.ok(m.includes(want), `missing: ${want}`);
  assert.ok(m.some((x) => x.startsWith("error en-US play.fullDescription: keyword list")));
  assert.ok(m.some((x) => x.includes("density")));
});

test("a clean keyword plan passes", () => {
  const { code, findings } = run("plan-good/keywords-en-US.md");
  assert.equal(code, 0);
  assert.deepEqual(findings, []);
});

test("a keyword plan fails on sources, competitors and the packed field", () => {
  const { code, findings } = run("plan-bad/keywords-en-US.md");
  assert.equal(code, 1);
  const m = msgs(findings);
  for (const want of [
    'error en-US keywords.targets: "motivation" has no source',
    'error en-US keywords.targets: competitor name "Streaks" as a target',
    'error en-US ios.keywords: "diary" already in name, subtitle or developer name',
    'error en-US ios.keywords: wasted on "app"',
    "warn en-US ios.keywords: metadata.json differs from the field packed in keywords-en-US.md",
  ])
    assert.ok(m.includes(want), `missing: ${want}`);
});

test("line budgets flag an overlong output file", async () => {
  const { mkdtempSync, writeFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const dir = mkdtempSync(join(tmpdir(), "aso-"));
  writeFileSync(join(dir, "keywords-de-DE.md"), "x\n".repeat(41));
  writeFileSync(join(dir, "context.md"), "x\n".repeat(10));
  const r = spawnSync("node", [join(here, "../plugin/skills/aso/scripts/check.mjs"), dir], { encoding: "utf8" });
  assert.equal(r.stdout.trim(), "! keywords-de-DE.md: 41/40 lines");
});

const dir = (fixture) => spawnSync("node", [join(here, "../plugin/skills/aso/scripts/check.mjs"), join(here, "fixtures", fixture)], { encoding: "utf8" });

test("the changelog flags a locale built on an older primary", () => {
  const r = dir("aso-dir");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /! changelog\.md de-DE: built on en-US 2026-08-01, en-US live since 2026-10-20 — stale/);
  assert.doesNotMatch(r.stdout, /fr-FR/);
});

test("the changelog fails on a malformed row", () => {
  const r = dir("aso-dir-bad");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /✗ changelog\.md 2026-11-01 fr-FR: status "shipped"/);
  assert.match(r.stdout, /✗ changelog\.md 11\/02\/2026 es-MX: 7 cells, want 8/);
});
