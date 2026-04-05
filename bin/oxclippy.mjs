#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const presetsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "presets");
const configPath = join(process.cwd(), ".oxlintrc.json");

function listPresets() {
  return readdirSync(presetsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

function loadPreset(name) {
  const presetPath = join(presetsDir, `${name}.json`);
  const preset = JSON.parse(readFileSync(presetPath, "utf8"));
  return preset.rules;
}

const args = process.argv.slice(2);
const command = args[0];

if (command === "init") {
  const presetName = args[1] ?? "recommended";

  if (!listPresets().includes(presetName)) {
    console.error(`Unknown preset: "${presetName}"`);
    console.error(`Available presets: ${listPresets().join(", ")}`);
    process.exit(1);
  }

  if (!existsSync(configPath)) {
    console.error("No .oxlintrc.json found in the current directory.");
    console.error("Run `npx oxlint --init` first to create one, then re-run this command.");
    process.exit(1);
  }

  const presetRules = loadPreset(presetName);
  const config = JSON.parse(readFileSync(configPath, "utf8"));

  if (!config.jsPlugins) {
    config.jsPlugins = [];
  }
  if (!config.jsPlugins.includes("oxclippy")) {
    config.jsPlugins.push("oxclippy");
  }

  if (!config.rules) {
    config.rules = {};
  }
  for (const [rule, level] of Object.entries(presetRules)) {
    config.rules[rule] = level;
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

  const ruleCount = Object.keys(presetRules).length;
  console.log(`Added ${ruleCount} rules from "${presetName}" preset to .oxlintrc.json`);
} else {
  console.log(`oxclippy — Rust Clippy lints for JS/TS

Usage:
  npx oxclippy init [preset]    Add preset rules to .oxlintrc.json

Presets:
  recommended  Style + Complexity + Correctness + Iterator + Functions + Principles (default)
  all          All 52 rules
  style        Style rules (8 rules)
  complexity   Complexity rules (6 rules)
  correctness  Correctness rules (7 rules)
  iterator     Iterator rules (13 rules)
  functions    Functions rules (5 rules)
  principles   Principles rules (5 rules)
  pedantic     Pedantic rules (8 rules)

Example:
  npx oxclippy init recommended
  npx oxclippy init correctness`);
}
