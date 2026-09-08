import { describe, expect, it } from 'vitest';
import { analyzeTokiPonaDominance } from './detector';

describe('detector', () => {
  it('passes clearly toki pona text', () => {
    const result = analyzeTokiPonaDominance('toki pona li pona tawa mi. mi moku e kili.', { threshold: 0.7 });
    expect(result.pass).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.7);
  });

  it('fails clearly non toki pona text', () => {
    const result = analyzeTokiPonaDominance('This is a regular English paragraph with many unrelated words.', {
      threshold: 0.7
    });

    expect(result.pass).toBe(false);
    expect(result.score).toBeLessThan(0.7);
  });

  it('handles punctuation, numbers and urls without unstable output', () => {
    const input = 'toki pona li pona! 1234 https://example.com jan li toki.';
    const first = analyzeTokiPonaDominance(input, { threshold: 0.7 });
    const second = analyzeTokiPonaDominance(input, { threshold: 0.7 });

    expect(first).toEqual(second);
    expect(first.totalTokens).toBeGreaterThan(0);
  });

  it('handles threshold boundary at 0.7', () => {
    const passCase = analyzeTokiPonaDominance('toki pona li pona tawa jan', { threshold: 0.7 });
    expect(passCase.score).toBeGreaterThanOrEqual(0.7);
    expect(passCase.pass).toBe(true);

    const failCase = analyzeTokiPonaDominance('toki pona li okay english words now', { threshold: 0.7 });
    expect(failCase.score).toBeLessThan(0.7);
    expect(failCase.pass).toBe(false);
  });

  it('returns complete diagnostics shape', () => {
    const result = analyzeTokiPonaDominance('toki pona li pona', { threshold: 0.7 });
    expect(result.totalTokens).toBeGreaterThan(0);
    expect(result.recognizedTokens).toBeGreaterThan(0);
    expect(typeof result.score).toBe('number');
    expect(typeof result.pass).toBe('boolean');
  });

  it('supports weighted strategy with rare-token penalties', () => {
    const withPenalty = analyzeTokiPonaDominance('pu', {
      threshold: 0.6,
      strategy: 'weighted',
      lexiconProfile: 'default',
      rareTokenPenalty: -0.45,
      minTokens: 1
    });

    const withoutPenalty = analyzeTokiPonaDominance('pu', {
      threshold: 0.6,
      strategy: 'weighted',
      lexiconProfile: 'default',
      rareTokenPenalty: 0,
      minTokens: 1
    });

    expect(withPenalty.detectorVersion).toBe('weighted:default:v1');
    expect(withPenalty.pass).toBe(false);
    expect(withoutPenalty.pass).toBe(true);
    expect(withoutPenalty.score).toBeGreaterThan(withPenalty.score);
  });

  it('respects minimum signal token guard', () => {
    const short = analyzeTokiPonaDominance('toki pona', {
      threshold: 0.01,
      strategy: 'weighted',
      lexiconProfile: 'default',
      minTokens: 12
    });

    expect(short.totalTokens).toBeLessThan(12);
    expect(short.pass).toBe(false);
    expect(short.score).toBe(0);
    expect(short.ignoredShortTokens).toBe(0);
  });

  it('ignores non-lexicon one-letter noise', () => {
    const result = analyzeTokiPonaDominance('toki x e a', {
      threshold: 0.5,
      strategy: 'simple',
      lexiconProfile: 'default',
      minTokens: 1
    });

    expect(result.ignoredShortTokens).toBe(1);
    expect(result.tokens).not.toContain('x');
    expect(result.tokens).toContain('toki');
  });
});
