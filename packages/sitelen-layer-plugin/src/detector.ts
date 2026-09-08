import { TOKI_PONA_LEXICON } from './tokiPonaLexicon';
import { tokenizeForDetection } from './tokenizer';
import type { DetectorResult, DetectionConfig } from './types';

export interface DetectorConfig extends DetectionConfig {
  threshold: number;
}

const RARE_LEXICON_TOKENS = new Set(['pu', 'ku', 'su']);
const COMMON_TOKEN_WEIGHT = 1;
const HISTORICAL_PENALTY = -0.45;
const SHORT_TOKEN_PENALTY = -0.2;
const FALLBACK_MIN_TOKENS = 4;
const DEFAULT_LEXICON = TOKI_PONA_LEXICON;
const EXTENDED_LEXICON = new Set([...TOKI_PONA_LEXICON, 'lanpan', 'kule', 'nasin', 'tonsi', 'kule']);

const COMMON_TOKENS: Record<string, number> = {
  a: 0.9,
  li: 1,
  e: 1,
  en: 0.95,
  la: 0.9,
  pi: 1,
  tawa: 1,
  mi: 1,
  ona: 0.95,
  kepeken: 0.85,
  lukin: 0.7
};

function isSignalToken(token: string, lexicon: Set<string>): boolean {
  if (token.length > 1) {
    return true;
  }

  // Keep one-letter toki pona particles, drop arbitrary one-letter noise.
  return lexicon.has(token);
}

export function analyzeTokiPonaDominance(text: string, config: DetectorConfig): DetectorResult {
  const strategy = config.strategy ?? 'simple';
  const minTokens = config.minTokens ?? FALLBACK_MIN_TOKENS;
  const lexicon = config.lexiconProfile === 'extended' ? EXTENDED_LEXICON : DEFAULT_LEXICON;
  const rarePenalty = config.rareTokenPenalty ?? HISTORICAL_PENALTY;

  const allTokens = tokenizeForDetection(text);
  const tokens = allTokens.filter((token) => isSignalToken(token, lexicon));
  const totalTokens = tokens.length;
  const ignoredShortTokens = allTokens.filter((token) => !isSignalToken(token, lexicon)).length;

  if (totalTokens === 0 || totalTokens < minTokens) {
    return {
      tokens,
      totalTokens,
      recognizedTokens: 0,
      score: 0,
      confidence: 0,
      pass: false,
      ignoredShortTokens,
      detectorVersion: `${strategy}:${config.lexiconProfile ?? 'default'}:v1`
    };
  }

  if (strategy === 'simple') {
    const recognizedTokens = tokens.reduce((count, token) => {
      return count + (lexicon.has(token) ? 1 : 0);
    }, 0);

    const score = recognizedTokens / totalTokens;

    return {
      tokens,
      totalTokens,
      recognizedTokens,
      score,
      confidence: score,
      pass: score >= config.threshold,
      ignoredShortTokens,
      detectorVersion: `${strategy}:${config.lexiconProfile ?? 'default'}:v1`
    };
  }

  const weightedRecognized = tokens.reduce((sum, token) => {
    if (!lexicon.has(token)) {
      return sum;
    }

    let weight = COMMON_TOKENS[token] ?? COMMON_TOKEN_WEIGHT;
    if (token.length <= 2) {
      weight += SHORT_TOKEN_PENALTY;
    }

    if (RARE_LEXICON_TOKENS.has(token)) {
      weight += rarePenalty;
    }

    return sum + Math.max(0, weight);
  }, 0);

  const maxWeighted = tokens.length * COMMON_TOKEN_WEIGHT;
  const score = maxWeighted > 0 ? Math.max(0, weightedRecognized / maxWeighted) : 0;
  const recognizedTokens = tokens.reduce((count, token) => {
    return count + (lexicon.has(token) ? 1 : 0);
  }, 0);

  return {
    tokens,
    totalTokens,
    recognizedTokens,
    score,
    confidence: score,
    pass: score >= config.threshold,
    ignoredShortTokens,
    detectorVersion: `${strategy}:${config.lexiconProfile ?? 'default'}:v1`
  };
}
