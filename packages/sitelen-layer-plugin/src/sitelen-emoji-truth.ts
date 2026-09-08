import {
  GENERATED_EMOJI_MAPPING,
  GENERATED_EMOJI_MAPPING_METADATA
} from './generated/emojiMapping.generated';
import type { NormalizedEmojiMapping } from './emoji/normalizeEmojiMapping';

export const sitelenEmojiTruth: NormalizedEmojiMapping = {
  ...GENERATED_EMOJI_MAPPING,
  metadata: GENERATED_EMOJI_MAPPING_METADATA
};

export const sitelenEmojiTruthEntries = sitelenEmojiTruth.entries;
export const sitelenEmojiTruthMetadata = sitelenEmojiTruth.metadata;

export default sitelenEmojiTruth;
