const path = require("node:path");

const defaultProfile = require(path.resolve(__dirname, "profiles/default-stable.v1.json"));

function lookup(word, profile = defaultProfile) {
  const entries = profile.entries || {};
  const aliases = profile.aliases || {};
  const key = String(word).trim().toLowerCase();
  const base = aliases[key] || key;
  return entries[key] || entries[base] || null;
}

function translate(text, profile = defaultProfile) {
  const punct = { ".": "_punct_period", ":": "_punct_colon" };
  return String(text).replace(/[A-Za-z_][A-Za-z0-9_-]*|[.:]/g, (token) => lookup(punct[token] || token, profile) || token);
}

module.exports = {
  defaultProfile,
  lookup,
  translate,
};
