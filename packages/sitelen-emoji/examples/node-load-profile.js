#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const profilePath = path.join(root, "profiles", "default-stable.v1.json");
const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));
const entries = profile.entries || {};
const aliases = profile.aliases || {};

function resolve(word) {
  const base = aliases[word] || word;
  return entries[word] || entries[base] || null;
}

for (const word of ["jan", "pona", "ali", "ale", "_punct_period"]) {
  console.log(`${word}\t${resolve(word) || "<missing>"}`);
}
