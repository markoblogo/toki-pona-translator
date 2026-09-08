import { describe, expect, it } from 'vitest';
import { toSitelenEmoji, toSitelenEmojiWithStats } from './emoji';

describe('emoji transformer', () => {
  it('replaces known tokens using generated mapping', () => {
    expect(toSitelenEmoji('jan pona')).toContain('👤');
    expect(toSitelenEmoji('jan pona')).toContain('👍');
  });

  it('keeps unknown tokens unchanged', () => {
    expect(toSitelenEmoji('unknownToken pona')).toContain('unknownToken');
  });

  it('preserves punctuation and spaces', () => {
    expect(toSitelenEmoji('jan, pona.')).toBe('👤, 👍➖️');
  });

  it('handles mixed-case words via lowercase normalization', () => {
    expect(toSitelenEmoji('JaN PoNa')).toBe('👤 👍');
  });

  it('reports replacement stats for diagnostics', () => {
    const result = toSitelenEmojiWithStats('jan pona li');
    expect(result.text).toContain('👤');
    expect(result.replacedTokens).toBeGreaterThan(0);
    expect(result.wordTokens).toBe(3);
  });

  it('reports stable top unmapped tokens without punctuation noise', () => {
    const result = toSitelenEmojiWithStats('Foo foo, Zzz zzz... Bar! jan');
    expect(result.unmappedWordCounts.foo).toBe(2);
    expect(result.unmappedWordCounts.zzz).toBe(2);
    expect(result.unmappedWordCounts.bar).toBe(1);
    expect(result.topUnmapped).toEqual([
      { token: 'foo', count: 2 },
      { token: 'zzz', count: 2 },
      { token: 'bar', count: 1 }
    ]);
    expect(result.topUnmapped.find((item) => item.token.includes('.'))).toBeUndefined();
  });

  it('keeps non-protocol tokens unmapped instead of applying local guesses', () => {
    const result = toSitelenEmojiWithStats('sona Sonko sitelen Lasina sona Seto');
    expect(result.text).toContain('Sonko');
    expect(result.text).toContain('Lasina');
    expect(result.text).toContain('Seto');
    expect(result.unmappedWordCounts.sonko).toBe(1);
    expect(result.unmappedWordCounts.lasina).toBe(1);
    expect(result.unmappedWordCounts.seto).toBe(1);
  });
});
