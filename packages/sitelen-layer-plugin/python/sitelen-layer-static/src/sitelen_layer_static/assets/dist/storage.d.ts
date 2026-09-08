import type { SitelenLayer } from './types';
export declare function readStoredLayer(storageKey: string): SitelenLayer | null;
export declare function writeStoredLayer(storageKey: string, layer: SitelenLayer): void;
