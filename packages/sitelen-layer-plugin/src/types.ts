export type SitelenLayer = 'latin' | 'sitelen-pona' | 'sitelen-emoji';
export type ToggleMode = 'floating' | 'inline' | 'auto';
export type ToggleSize = 'sm' | 'md' | 'lg';

export type LayerModeSource =
  | 'default'
  | 'storage'
  | 'forced-latin-ineligible'
  | 'fallback-font-missing'
  | 'profile';

export interface Diagnostics {
  totalTokens: number;
  recognizedTokens: number;
  score: number;
  pass: boolean;
}

export interface LayerUsageSnapshot {
  countsByLayer: Record<SitelenLayer, number>;
  totalSwitches: number;
  activeLayer: SitelenLayer;
  collectedAt: string;
  windowSeconds?: number;
}

export interface LayerUsageSnapshotOptions {
  since?: string;
  timeWindowMs?: number;
  maxEntries?: number;
}

export interface UnmappedSnapshot {
  layer: SitelenLayer;
  tokens: TokenFrequency[];
  generatedAt: string;
  since?: string;
}

export interface UnmappedSnapshotOptions {
  layer?: SitelenLayer;
  limit?: number;
  since?: string;
}

export interface DetectionConfig {
  strategy?: 'simple' | 'weighted';
  lexiconProfile?: 'default' | 'extended';
  minTokens?: number;
  rareTokenPenalty?: number;
}

export interface TelemetryEvent {
  version: number;
  fingerprint: string;
  event: string;
  id: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface TelemetryConfig {
  enabled: true;
  beaconUrl?: string;
  sampleRate?: number;
  includeLayerUsage?: boolean;
  hashSalt?: string;
  batchSize?: number;
  flushIntervalMs?: number;
  maxQueueSize?: number;
  maxRetries?: number;
  retryBackoffMs?: number;
}

export interface ThemeConfig {
  transition?: 'none' | 'fade' | 'fade-blur';
  customCssVars?: Record<string, string>;
}

export interface ObserverStats {
  mutationsObserved: number;
  batchesProcessed: number;
  incrementalUpdates: number;
  fullRefreshes: number;
  lastMutationAt?: string;
}

export interface TokenFrequency {
  token: string;
  count: number;
}

export interface PluginDiagnostics extends Diagnostics {
  threshold: number;
  detectorVersion: string;
  detectionStrategy: 'simple' | 'weighted';
  confidence: number;
  ignoredShortTokens: number;
  lexiconProfile: 'default' | 'extended';
  eligible: boolean;
  activeLayer: SitelenLayer;
  containerInfo: string;
  modeSource: LayerModeSource;
  availableLayers: SitelenLayer[];
  ignoredCandidates: number;
  sitelenPonaFontReady: boolean;
  sitelenPonaRenderMode: 'ligature-font' | 'font-only' | 'transform';
  sitelenPonaTextRewrite: boolean;
  sitelenPonaReplacementCount: number;
  sitelenPonaWordTokenCount: number;
  sitelenPonaCoverageRatio: number | null;
  sitelenPonaTopUnmapped: TokenFrequency[];
  sitelenPonaWarning?: string;
  toggleMountMode: 'floating' | 'inline';
  toggleSize: ToggleSize;
  toggleMountedIn?: string;
  emojiReplacementCount: number;
  emojiCoverageRatio: number;
  emojiTopUnmapped: TokenFrequency[];
  matchedProfileId?: string | null;
  matchedProfileReason?: string;
  profileId?: string | null;
  lastUpdatedAt: string;
  observerStats: ObserverStats;
}

export interface DetectorResult extends Diagnostics {
  tokens: string[];
  confidence: number;
  detectorVersion: string;
  ignoredShortTokens: number;
}

export interface SitelenPonaConfig {
  enabled?: boolean;
  fontFamily?: string;
  fontCssUrl?: string;
  applyToRoot?: boolean;
  className?: string;
  renderStrategy?: 'ligature-font' | 'font-only' | 'transform';
  transformStrategy?: 'mvp' | 'rules' | 'api';
  transformerEndpoint?: string;
  transformerTimeoutMs?: number;
}

export interface ToggleLabelSpec {
  text?: string;
  ariaLabel?: string;
  title?: string;
  className?: string;
}

export type ToggleLayerLabel = string | ToggleLabelSpec;
export type ToggleLabels = Partial<Record<SitelenLayer, ToggleLayerLabel>>;

export interface MutationObserverConfig {
  enabled?: boolean;
  debounceMs?: number;
  incremental?: boolean;
  observeAttributes?: boolean;
  attributeFilter?: string[];
  maxBatchNodes?: number;
}

export interface SpaNavigationConfig {
  enabled?: boolean;
  patchHistory?: boolean;
  refreshDelayMs?: number;
}

export interface SitelenLayerPluginConfig {
  container?: string | Element;
  threshold?: number;
  layers?: SitelenLayer[];
  defaultLayer?: SitelenLayer;
  showToggle?: boolean;
  toggleMount?: string | Element;
  toggleMode?: ToggleMode;
  toggleSize?: ToggleSize;
  toggleLabels?: ToggleLabels;
  emojiExcludeSelectors?: string[];
  excludeSelectors?: string[];
  debug?: boolean;
  debugOverlay?: boolean;
  diagnosticsOverlay?: boolean;
  storageKey?: string;
  requireDominantTokiPona?: boolean;
  theme?: ThemeConfig;
  detection?: DetectionConfig;
  telemetry?: false | TelemetryConfig;

  observeMutations?: boolean;
  mutationDebounceMs?: number;
  mutationObserver?: MutationObserverConfig;

  observeNavigation?: boolean;
  spaNavigation?: SpaNavigationConfig;

  sitelenPona?: SitelenPonaConfig;

  profileId?: string | null;
  profileMatchReason?: string;
  onProfileMatch?: (profileId: string | null) => void;
  onEligibilityChange?: (eligible: boolean, diagnostics: PluginDiagnostics) => void;
  onDiagnostics?: (diagnostics: PluginDiagnostics) => void;
  onLayerChange?: (layer: SitelenLayer, diagnostics: PluginDiagnostics) => void;
}

export interface SitelenLayerProfileMatch {
  hostname?: string | RegExp;
  pathnamePrefix?: string;
  pathnameRegex?: RegExp;
  lang?: string;
}

export interface SitelenLayerProfile {
  id: string;
  match?: SitelenLayerProfileMatch;
  config: Partial<SitelenLayerPluginConfig>;
  priority?: number;
  enabled?: boolean;
}

export interface ProfileResolverOptions {
  location?: Location;
  lang?: string;
}

export interface ResolvedProfile {
  profile: SitelenLayerProfile;
  reason: string;
  config: SitelenLayerPluginConfig;
}

export interface CreateFromProfilesOptions extends ProfileResolverOptions {
  baseConfig?: SitelenLayerPluginConfig;
}

export interface TokiPonaLocalePresetOptions {
  tpPathPrefix?: string;
  nonTpPathPrefix?: string;
  container: string;
  toggleMount?: string;
  toggleMode?: ToggleMode;
  toggleSize?: ToggleSize;
  toggleLabels?: ToggleLabels;
  emojiExcludeSelectors?: string[];
  storageKey?: string;
  threshold?: number;
  debug?: boolean;
  debugOverlay?: boolean;
  nonTpShowToggle?: boolean;
  mutationObserver?: MutationObserverConfig;
  sitelenPona?: SitelenPonaConfig;
}
