import { describe, expect, it } from 'vitest';
import { toSitelenPona, toSitelenPonaWithStats } from './sitelenPonaTransform';

describe('sitelen pona transform (mvp)', () => {
  it('replaces known tokens from mvp mapping', () => {
    expect(toSitelenPona('toki pona jan')).toBe('⟐ ✧ ☉');
  });

  it('keeps unknown tokens unchanged', () => {
    expect(toSitelenPona('unknown pona')).toBe('unknown ✧');
  });

  it('preserves punctuation and spaces', () => {
    expect(toSitelenPona('toki, pona.')).toBe('⟐, ✧.');
  });

  it('returns replacement stats', () => {
    const result = toSitelenPonaWithStats('toki pona li jan');
    expect(result.text).toBe('⟐ ✧ ∴ ☉');
    expect(result.replacedTokens).toBe(4);
    expect(result.wordTokens).toBe(4);
  });

  it('reports top unmapped tokens and excludes replaced ones', () => {
    const result = toSitelenPonaWithStats('sona foo foo bar toki');
    expect(result.unmappedWordCounts.foo).toBe(2);
    expect(result.unmappedWordCounts.bar).toBe(1);
    expect(result.unmappedWordCounts.sona).toBeUndefined();
    expect(result.topUnmapped).toEqual([
      { token: 'foo', count: 2 },
      { token: 'bar', count: 1 }
    ]);
  });

  it('covers additional high-frequency toki-free /tp words', () => {
    const result = toSitelenPonaWithStats('mani lawa poka olin anu kin pilin nanpa kalama utala');
    expect(result.replacedTokens).toBe(10);
    expect(result.wordTokens).toBe(10);
    expect(result.topUnmapped).toEqual([]);
  });
});
