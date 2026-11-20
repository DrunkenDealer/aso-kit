#!/usr/bin/env node
const [cmd] = process.argv.splice(2, 1);
if (!["check", "store", "drift"].includes(cmd)) {
  console.error("usage: aso-kit <check|store|drift> [args]");
  process.exit(2);
}
await import(`./${cmd}.mjs`);
