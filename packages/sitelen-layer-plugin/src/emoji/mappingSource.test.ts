import { describe, expect, it } from 'vitest';
import { getEmojiMapping } from './mappingSource';

describe('emoji mapping source', () => {
  it('uses the vendored sitelen-emoji-truth default-stable profile by default', () => {
    const mapping = getEmojiMapping();

    expect(mapping.metadata.source).toContain('vendor/sitelen-emoji-truth/default-stable.v1.json');
    expect(mapping.metadata.source).not.toContain('local-overrides');
    expect(mapping.wordMap.toki).toBe('🗣️');
    expect(mapping.wordMap.pona).toBe('👍');
    expect(mapping.wordMap.kin).toBeUndefined();
  });

  it('resolves aliases and punctuation from the protocol profile', () => {
    const mapping = getEmojiMapping();

    expect(mapping.wordMap.ali).toBe(mapping.wordMap.ale);
    expect(mapping.punctuationMap['.']).toBe('➖️');
    expect(mapping.punctuationMap[':']).toBe('➗️');
  });
});
