import { describe, expect, it } from 'vitest';
import { isWordToken, tokenizeForDetection, tokenizeForReplacement } from './tokenizer';

describe('tokenizer', () => {
  it('tokenizes toki pona phrases for detection', () => {
    expect(tokenizeForDetection('toki pona li pona.')).toEqual(['toki', 'pona', 'li', 'pona']);
  });

  it('removes URLs from detection tokens', () => {
    expect(tokenizeForDetection('toki pona https://example.com jan li pona')).toEqual([
      'toki',
      'pona',
      'jan',
      'li',
      'pona'
    ]);
  });

  it('preserves punctuation and spaces in replacement tokenization', () => {
    expect(tokenizeForReplacement('toki,  pona!')).toEqual(['toki', ',', '  ', 'pona', '!']);
  });

  it('handles mixed case, numbers, and line breaks', () => {
    expect(tokenizeForReplacement('ToKi\nPONA 123')).toEqual(['ToKi', '\n', 'PONA', ' ', '123']);
  });

  it('returns empty tokens for empty strings in detection', () => {
    expect(tokenizeForDetection('')).toEqual([]);
  });

  it('detects word tokens correctly', () => {
    expect(isWordToken('toki')).toBe(true);
    expect(isWordToken('toki-pona')).toBe(true);
    expect(isWordToken('123')).toBe(false);
    expect(isWordToken('!')).toBe(false);
  });
});
