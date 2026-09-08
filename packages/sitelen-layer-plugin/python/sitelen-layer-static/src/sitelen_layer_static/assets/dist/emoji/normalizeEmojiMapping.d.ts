export interface EmojiEntry {
    token: string;
    output: string;
    aliases?: string[];
}
export interface NormalizedEmojiMapping {
    entries: EmojiEntry[];
    wordMap: Record<string, string>;
    punctuationMap: Record<string, string>;
    metadata: {
        source: string;
        version: string;
        generatedAt: string;
    };
}
export declare function normalizeEmojiMapping(input: unknown, source?: string): NormalizedEmojiMapping;
