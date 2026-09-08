const profile = require('../../packages/sitelen-emoji/profiles/default-stable.v1.json');

const allowedWords = new Set(
  Object.keys(profile.entries || {}).filter((word) => !word.startsWith('_'))
);

function buildTranslationPrompt(inputText) {
  return `Translate the JSON string below into Toki Pona.

Return one JSON object with:
- sourceLang: detected language code
- tokiPonaWords: an array containing only lowercase words from the canonical Toki Pona profile
- explanation: 1-2 short English sentences

User text as JSON:
${JSON.stringify(String(inputText))}`;
}

function normalizeTranslationResult(value) {
  if (!value || typeof value !== 'object') {
    throw new Error('Translation result must be an object');
  }

  const sourceLang = typeof value.sourceLang === 'string' ? value.sourceLang.trim() : '';
  const explanation = typeof value.explanation === 'string' ? value.explanation.trim() : '';
  if (!sourceLang || !explanation || !Array.isArray(value.tokiPonaWords) || !value.tokiPonaWords.length) {
    throw new Error('Translation result is missing required fields');
  }

  const tokiPonaWords = value.tokiPonaWords.map((word) =>
    typeof word === 'string' ? word.trim().toLowerCase() : ''
  );
  const invalidWords = tokiPonaWords.filter((word) => !allowedWords.has(word));
  if (invalidWords.length) {
    throw new Error(`Translation contains words outside the canonical profile: ${invalidWords.join(', ')}`);
  }

  return { sourceLang, tokiPonaWords, explanation };
}

module.exports = {
  buildTranslationPrompt,
  normalizeTranslationResult,
};
