import type { DetectorResult, DetectionConfig } from './types';
export interface DetectorConfig extends DetectionConfig {
    threshold: number;
}
export declare function analyzeTokiPonaDominance(text: string, config: DetectorConfig): DetectorResult;
