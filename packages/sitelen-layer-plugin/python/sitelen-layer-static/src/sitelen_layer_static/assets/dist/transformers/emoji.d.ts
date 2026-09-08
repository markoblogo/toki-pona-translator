import type { TokenFrequency } from '../types';
export interface EmojiTransformResult {
    text: string;
    replacedTokens: number;
    wordTokens: number;
    unmappedWordCounts: Record<string, number>;
    topUnmapped: TokenFrequency[];
}
export declare function toSitelenEmoji(text: string): string;
export declare function toSitelenEmojiWithStats(text: string): EmojiTransformResult;
