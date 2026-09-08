import { getEmojiMapping } from '../emoji/mappingSource';
import { isWordToken, tokenizeForReplacement } from '../tokenizer';
import type { TokenFrequency } from '../types';

const TOP_UNMAPPED_LIMIT = 10;

export interface EmojiTransformResult {
  text: string;
  replacedTokens: number;
  wordTokens: number;
  unmappedWordCounts: Record<string, number>;
  topUnmapped: TokenFrequency[];
}

export function toSitelenEmoji(text: string): string {
  return toSitelenEmojiWithStats(text).text;
}

export function toSitelenEmojiWithStats(text: string): EmojiTransformResult {
  const mapping = getEmojiMapping();
  const parts = tokenizeForReplacement(text);
  let replacedTokens = 0;
  let wordTokens = 0;
  const unmappedWordCounts: Record<string, number> = {};

  const transformed = parts
    .map((part) => {
      if (isWordToken(part)) {
        wordTokens += 1;
        const normalized = part.toLowerCase();
        const replacement = mapping.wordMap[normalized];
        if (replacement && replacement !== part) {
          replacedTokens += 1;
          return replacement;
        }

        unmappedWordCounts[normalized] = (unmappedWordCounts[normalized] ?? 0) + 1;
        return part;
      }

      if (part.length === 1 && mapping.punctuationMap[part]) {
        return mapping.punctuationMap[part];
      }

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
