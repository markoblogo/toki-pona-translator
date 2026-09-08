import {
  GENERATED_EMOJI_MAPPING,
  GENERATED_EMOJI_MAPPING_METADATA
} from '../generated/emojiMapping.generated';
import type { NormalizedEmojiMapping } from './normalizeEmojiMapping';

let runtimeMapping: NormalizedEmojiMapping = {
  ...GENERATED_EMOJI_MAPPING,
  metadata: GENERATED_EMOJI_MAPPING_METADATA
};

export function getEmojiMapping(): NormalizedEmojiMapping {
  return runtimeMapping;
}

export function setEmojiMapping(mapping: NormalizedEmojiMapping): void {
  runtimeMapping = mapping;
}
