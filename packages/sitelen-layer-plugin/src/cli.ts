import { analyzeTokiPonaDominance } from './detector';
import type { DetectionConfig, SitelenLayer, TokenFrequency } from './types';
import { GENERATED_EMOJI_MAPPING } from './generated/emojiMapping.generated';

export interface CliScanOptions {
  threshold?: number;
  strategy?: DetectionConfig['strategy'];
  lexiconProfile?: DetectionConfig['lexiconProfile'];
  minTokens?: number;
  rareTokenPenalty?: number;
}

export interface CliScanResult {
  file: string;
  score: number;
  pass: boolean;
  totalTokens: number;
  recognizedTokens: number;
  confidence: number;
  detectionVersion: string;
  strategy: 'simple' | 'weighted';
  lexiconProfile: 'default' | 'extended';
  recommendations: SitelenLayer[];
  warnings: string[];
}

const DEFAULT_DETECTION: Required<Pick<DetectionConfig, 'strategy' | 'lexiconProfile' | 'minTokens' | 'rareTokenPenalty'>> = {
  strategy: 'weighted',
  lexiconProfile: 'default',
  minTokens: 8,
  rareTokenPenalty: -0.45
};

const WORD_PATTERN = /[a-zA-Z][a-zA-Z'-]*/g;
const URL_PATTERN = /https?:\/\/\S+/gi;

function normalizeLayerRecommendations(scan: { pass: boolean; score: number; totalTokens: number }, threshold: number): SitelenLayer[] {
  const layers: SitelenLayer[] = ['latin'];

  if (!scan.pass) {
    return ['latin'];
  }

  layers.push('sitelen-emoji');
  if (scan.score >= threshold + 0.08) {
    layers.push('sitelen-pona');
  }

  return layers;
}

export function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeText(text: string): string[] {
  const normalized = text.toLowerCase().replace(URL_PATTERN, ' ');
  return normalized.match(WORD_PATTERN) ?? [];
}

export function scanTextForLayerEligibility(text: string, options: CliScanOptions = {}): CliScanResult {
  const resolvedDetection = {
    ...DEFAULT_DETECTION,
    ...options,
    rareTokenPenalty: options.rareTokenPenalty ?? DEFAULT_DETECTION.rareTokenPenalty
  };

  const det = analyzeTokiPonaDominance(text, {
    threshold: options.threshold ?? 0.7,
    strategy: resolvedDetection.strategy,
    lexiconProfile: resolvedDetection.lexiconProfile,
    minTokens: resolvedDetection.minTokens,
    rareTokenPenalty: resolvedDetection.rareTokenPenalty
  });

  const warnings: string[] = [];
  if (det.totalTokens < resolvedDetection.minTokens) {
    warnings.push(`detected token count is low (${det.totalTokens}); minimum is ${resolvedDetection.minTokens}`);
  }

  if (det.totalTokens > 0 && det.recognizedTokens === 0) {
    warnings.push('no toki pona tokens detected for configured profile');
  }

  return {
    file: '',
    score: det.score,
    pass: det.pass,
    totalTokens: det.totalTokens,
    recognizedTokens: det.recognizedTokens,
    confidence: det.confidence,
    detectionVersion: det.detectorVersion,
    strategy: resolvedDetection.strategy,
    lexiconProfile: resolvedDetection.lexiconProfile,
    recommendations: normalizeLayerRecommendations(det, options.threshold ?? 0.7),
    warnings
  };
}

export function scanHtmlForLayerEligibility(file: string, html: string, options: CliScanOptions = {}): CliScanResult {
  const result = scanTextForLayerEligibility(extractTextFromHtml(html), options);
  return { ...result, file };
}

export function topUnmappedEmojiFromText(htmlOrText: string, limit = 10): TokenFrequency[] {
  const text = htmlOrText.includes('<') ? extractTextFromHtml(htmlOrText) : htmlOrText;
  const tokens = tokenizeText(text);

  const known = GENERATED_EMOJI_MAPPING.wordMap;
  const freq: Record<string, number> = {};

  for (const token of tokens) {
    const normalized = token.toLowerCase();
    if (!known[normalized]) {
      freq[normalized] = (freq[normalized] ?? 0) + 1;
    }
  }

  return Object.entries(freq)
    .filter(([token, count]) => token.length > 0 && count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, Math.max(1, limit))
    .map(([token, count]) => ({
      token,
      count
    }));
}
