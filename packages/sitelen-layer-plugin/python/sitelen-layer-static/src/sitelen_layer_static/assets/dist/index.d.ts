import { SitelenLayerPlugin } from './plugin';
import { getEmojiMapping, setEmojiMapping } from './emoji/mappingSource';
import { createSitelenLayerPluginFromProfiles, resolveProfile, resolveProfileConfig } from './profiles';
import { createTokiPonaLocaleProfiles } from './presets';
import type { SitelenLayerPluginConfig } from './types';
export declare function createSitelenLayerPlugin(config?: SitelenLayerPluginConfig): SitelenLayerPlugin;
export { SitelenLayerPlugin, getEmojiMapping, setEmojiMapping, createSitelenLayerPluginFromProfiles, createTokiPonaLocaleProfiles, resolveProfile, resolveProfileConfig };
export type { DetectionConfig, DetectorResult, CreateFromProfilesOptions, Diagnostics, TelemetryConfig, ThemeConfig, MutationObserverConfig, ObserverStats, PluginDiagnostics, ProfileResolverOptions, ResolvedProfile, SitelenLayer, SitelenLayerPluginConfig, LayerUsageSnapshotOptions, SitelenLayerProfile, SitelenLayerProfileMatch, SitelenPonaConfig, LayerUsageSnapshot, UnmappedSnapshot, UnmappedSnapshotOptions, SpaNavigationConfig, ToggleLabelSpec, ToggleLabels, ToggleMode, ToggleSize, TokiPonaLocalePresetOptions } from './types';
export type { EmojiEntry, NormalizedEmojiMapping } from './emoji/normalizeEmojiMapping';
