const assert = require("node:assert/strict");
const test = require("node:test");
const { defaultProfile, lookup, translate } = require("./index");

test("lookup resolves words and aliases", () => {
  assert.equal(lookup("toki"), "🗣️");
  assert.equal(lookup("ali"), lookup("ale"));
  assert.equal(defaultProfile.entries.pona, "👍");
});

test("translate maps known tokens and preserves unknown text", () => {
  assert.equal(translate("jan pona"), "👤 👍");
  assert.equal(translate("jan xyz."), "👤 xyz➖️");
});
