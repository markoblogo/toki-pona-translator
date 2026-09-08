import { isWordToken, tokenizeForReplacement } from '../tokenizer';
import type { TokenFrequency } from '../types';
import { SITELEN_PONA_MVP_MAPPING } from './sitelenPonaMapping';

const TOP_UNMAPPED_LIMIT = 10;

export interface SitelenPonaTransformResult {
  text: string;
  replacedTokens: number;
  wordTokens: number;
  unmappedWordCounts: Record<string, number>;
  topUnmapped: TokenFrequency[];
}

export function toSitelenPona(text: string): string {
  return toSitelenPonaWithStats(text).text;
}

export function toSitelenPonaWithStats(text: string): SitelenPonaTransformResult {
  const parts = tokenizeForReplacement(text);
  let replacedTokens = 0;
  let wordTokens = 0;
  const unmappedWordCounts: Record<string, number> = {};

  const transformed = parts
    .map((part) => {
      if (!isWordToken(part)) {
        return part;
      }

      wordTokens += 1;
      const normalized = part.toLowerCase();
      const replacement = SITELEN_PONA_MVP_MAPPING[normalized];
      if (replacement) {
        replacedTokens += 1;
        return replacement;
      }

      unmappedWordCounts[normalized] = (unmappedWordCounts[normalized] ?? 0) + 1;

      return part;
    })
    .join('');

  return {
    text: transformed,
    replacedTokens,
    wordTokens,
    unmappedWordCounts,
    topUnmapped: toTopTokenList(unmappedWordCounts)
  };
}

function toTopTokenList(freqMap: Record<string, number>): TokenFrequency[] {
  return Object.entries(freqMap)
    .filter(([token, count]) => token.trim().length > 0 && count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP_UNMAPPED_LIMIT)
    .map(([token, count]) => ({ token, count }));
}
