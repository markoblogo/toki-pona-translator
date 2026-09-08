import type { TokenFrequency } from '../types';
export interface SitelenPonaTransformResult {
    text: string;
    replacedTokens: number;
    wordTokens: number;
    unmappedWordCounts: Record<string, number>;
    topUnmapped: TokenFrequency[];
}
export declare function toSitelenPona(text: string): string;
export declare function toSitelenPonaWithStats(text: string): SitelenPonaTransformResult;
