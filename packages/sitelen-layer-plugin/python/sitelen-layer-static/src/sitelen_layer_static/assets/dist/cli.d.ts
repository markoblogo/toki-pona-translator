import type { DetectionConfig, SitelenLayer, TokenFrequency } from './types';
export interface CliScanOptions {
    threshold?: number;
    strategy?: DetectionConfig['strategy'];
    lexiconProfile?: DetectionConfig['lexiconProfile'];
    minTokens?: number;
    rareTokenPenalty?: number;
}
export interface CliScanResult {
    file: string;
    score: number;
    pass: boolean;
    totalTokens: number;
    recognizedTokens: number;
    confidence: number;
    detectionVersion: string;
    strategy: 'simple' | 'weighted';
    lexiconProfile: 'default' | 'extended';
    recommendations: SitelenLayer[];
    warnings: string[];
}
export declare function extractTextFromHtml(html: string): string;
export declare function tokenizeText(text: string): string[];
export declare function scanTextForLayerEligibility(text: string, options?: CliScanOptions): CliScanResult;
export declare function scanHtmlForLayerEligibility(file: string, html: string, options?: CliScanOptions): CliScanResult;
export declare function topUnmappedEmojiFromText(htmlOrText: string, limit?: number): TokenFrequency[];
