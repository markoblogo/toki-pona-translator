import './styles.css';
import { collectTextNodes, collectTextNodesInSubtree, isTextNodeAllowed } from './dom-walker';
import { analyzeTokiPonaDominance } from './detector';
import { resolveEligibility } from './eligibility';
import { writeStoredLayer, readStoredLayer } from './storage';
import { toSitelenEmojiWithStats } from './transformers/emoji';
import { toSitelenPonaWithStats } from './transformers/sitelenPonaTransform';
import {
  DEFAULT_SITELEN_PONA_FONT,
  applyContainerLayerClass,
  applySitelenPonaVariables,
  clearSitelenPonaVariables,
  ensureFontCssLink,
  getSitelenPonaClassName,
  isSitelenPonaFontReady
} from './transformers/sitelenPona';
import { LayerToggle } from './ui/toggle';
import { DebugOverlay } from './ui/debugOverlay';
import type {
  LayerModeSource,
  MutationObserverConfig,
  LayerUsageSnapshot,
  LayerUsageSnapshotOptions,
  TelemetryConfig,
  ObserverStats,
  PluginDiagnostics,
  DetectionConfig,
  SitelenLayer,
  SitelenLayerPluginConfig,
  SitelenPonaConfig,
  ThemeConfig,
  TelemetryEvent,
  SpaNavigationConfig,
  UnmappedSnapshot,
  UnmappedSnapshotOptions,
  TokenFrequency,
  ToggleLabels,
  ToggleMode,
  ToggleSize
} from './types';

const DEFAULT_LAYERS: SitelenLayer[] = ['latin', 'sitelen-pona', 'sitelen-emoji'];
const DEFAULT_STORAGE_KEY = 'sitelen-layer-plugin:layer';
const DEFAULT_DEBOUNCE_MS = 200;
const DEFAULT_MAX_BATCH_NODES = 250;
const DEFAULT_NAVIGATION_REFRESH_DELAY = 60;
const DEFAULT_TOGGLE_MODE: ToggleMode = 'auto';
const DEFAULT_TOGGLE_SIZE: ToggleSize = 'md';
const TOP_UNMAPPED_LIMIT = 10;
const PLUGIN_UI_SELECTOR = '[data-sitelen-layer-ui]';
const DEFAULT_TELEMETRY_SAMPLE_RATE = 1;
const DEFAULT_TELEMETRY_BEACON = '/sitelen-layer/telemetry';
const DEFAULT_TELEMETRY_FLUSH_MS = 2500;
const DEFAULT_TELEMETRY_BATCH_SIZE = 20;
const DEFAULT_TELEMETRY_MAX_QUEUE = 240;
const DEFAULT_TELEMETRY_MAX_RETRIES = 2;
const DEFAULT_TELEMETRY_RETRY_BACKOFF_MS = 1000;
const TELEMETRY_QUEUE_KEY = 'sitelen-layer-plugin:telemetry-queue';
const LAYER_USAGE_HISTORY_LIMIT = 1200;

const HISTORY_PATCH_MARKER = '__sitelenLayerPatched__';
const historyListeners = new Set<() => void>();
let originalPushState: History['pushState'] | null = null;
let originalReplaceState: History['replaceState'] | null = null;

function notifyHistoryListeners(): void {
  historyListeners.forEach((listener) => listener());
}

function installHistoryPatch(): void {
  if ((history as History & { [HISTORY_PATCH_MARKER]?: boolean })[HISTORY_PATCH_MARKER]) {
    return;
  }

  originalPushState = history.pushState;
  originalReplaceState = history.replaceState;

  history.pushState = function pushStatePatched(...args): void {
    originalPushState?.apply(this, args);
    notifyHistoryListeners();
  };

  history.replaceState = function replaceStatePatched(...args): void {
    originalReplaceState?.apply(this, args);
    notifyHistoryListeners();
  };

  (history as History & { [HISTORY_PATCH_MARKER]?: boolean })[HISTORY_PATCH_MARKER] = true;
}

function uninstallHistoryPatchIfUnused(): void {
  if (historyListeners.size > 0) {
    return;
  }

  const marked = history as History & { [HISTORY_PATCH_MARKER]?: boolean };
  if (!marked[HISTORY_PATCH_MARKER]) {
    return;
  }

  if (originalPushState) {
    history.pushState = originalPushState;
  }

  if (originalReplaceState) {
    history.replaceState = originalReplaceState;
  }

  delete marked[HISTORY_PATCH_MARKER];
  originalPushState = null;
  originalReplaceState = null;
}

function resolveElement(target: string | Element | undefined): Element | null {
  if (!target) {
    return null;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return target;
}

function isValidLayer(value: string | undefined): value is SitelenLayer {
  return value === 'latin' || value === 'sitelen-pona' || value === 'sitelen-emoji';
}

function isValidToggleSize(value: string | undefined): value is ToggleSize {
  return value === 'sm' || value === 'md' || value === 'lg';
}

function describeContainer(container: Element, configuredTarget?: string | Element): string {
  if (typeof configuredTarget === 'string') {
    return configuredTarget;
  }

  if (container === document.body) {
    return 'body';
  }

  const id = container.getAttribute('id');
  if (id) {
    return `${container.tagName.toLowerCase()}#${id}`;
  }

  return container.tagName.toLowerCase();
}

function describeElement(target: string | Element | null | undefined): string | undefined {
  if (!target) {
    return undefined;
  }

  if (typeof target === 'string') {
    return target;
  }

  if (target === document.body) {
    return 'body';
  }

  const id = target.getAttribute('id');
  if (id) {
    return `${target.tagName.toLowerCase()}#${id}`;
  }

  return target.tagName.toLowerCase();
}

function defaultSitelenPonaConfig(config?: SitelenPonaConfig): Required<SitelenPonaConfig> {
  return {
    enabled: config?.enabled ?? true,
    fontFamily: config?.fontFamily ?? DEFAULT_SITELEN_PONA_FONT,
    fontCssUrl: config?.fontCssUrl ?? '',
    applyToRoot: config?.applyToRoot ?? false,
    className: config?.className ?? '',
    renderStrategy: config?.renderStrategy ?? 'ligature-font',
    transformStrategy: config?.transformStrategy ?? 'mvp',
    transformerEndpoint: config?.transformerEndpoint ?? '',
    transformerTimeoutMs: config?.transformerTimeoutMs ?? 2500
  };
}

function defaultMutationObserverConfig(
  config: SitelenLayerPluginConfig
): Required<Omit<MutationObserverConfig, 'attributeFilter'>> & { attributeFilter?: string[] } {
  const source = config.mutationObserver ?? {};

  return {
    enabled: source.enabled ?? config.observeMutations ?? false,
    debounceMs: source.debounceMs ?? config.mutationDebounceMs ?? DEFAULT_DEBOUNCE_MS,
    incremental: source.incremental ?? true,
    observeAttributes: source.observeAttributes ?? false,
    attributeFilter: source.attributeFilter,
    maxBatchNodes: source.maxBatchNodes ?? DEFAULT_MAX_BATCH_NODES
  };
}

function defaultDetectionConfig(config: SitelenLayerPluginConfig): Required<DetectionConfig> {
  return {
    strategy: config.detection?.strategy ?? 'weighted',
    lexiconProfile: config.detection?.lexiconProfile ?? 'default',
    minTokens: config.detection?.minTokens ?? 4,
    rareTokenPenalty: config.detection?.rareTokenPenalty ?? 0
  };
}

function defaultThemeConfig(): Required<ThemeConfig> {
  return {
    transition: 'fade',
    customCssVars: {
      '--slp-toggle-motion-duration': '190ms',
      '--slp-toggle-shadow': '0 10px 22px rgba(0,0,0,0.25)',
      '--slp-toggle-radius': '14px',
      '--slp-toggle-transition': '190ms ease'
    }
  };
}

function defaultTelemetryConfig(config: SitelenLayerPluginConfig): TelemetryConfig | false {
  if (config.telemetry === false || config.telemetry == null) {
    return false;
  }

  return {
    enabled: true,
    beaconUrl: config.telemetry.beaconUrl ?? DEFAULT_TELEMETRY_BEACON,
    sampleRate: config.telemetry.sampleRate ?? DEFAULT_TELEMETRY_SAMPLE_RATE,
    includeLayerUsage: config.telemetry.includeLayerUsage ?? false,
    hashSalt: config.telemetry.hashSalt,
    batchSize: config.telemetry.batchSize ?? DEFAULT_TELEMETRY_BATCH_SIZE,
    flushIntervalMs: config.telemetry.flushIntervalMs ?? DEFAULT_TELEMETRY_FLUSH_MS,
    maxQueueSize: config.telemetry.maxQueueSize ?? DEFAULT_TELEMETRY_MAX_QUEUE,
    maxRetries: config.telemetry.maxRetries ?? DEFAULT_TELEMETRY_MAX_RETRIES,
    retryBackoffMs: config.telemetry.retryBackoffMs ?? DEFAULT_TELEMETRY_RETRY_BACKOFF_MS
  };
}

function defaultSpaNavigationConfig(config: SitelenLayerPluginConfig): Required<SpaNavigationConfig> {
  const source = config.spaNavigation ?? {};

  return {
    enabled: source.enabled ?? config.observeNavigation ?? false,
    patchHistory: source.patchHistory ?? true,
    refreshDelayMs: source.refreshDelayMs ?? DEFAULT_NAVIGATION_REFRESH_DELAY
  };
}

interface ResolvedConfig {
  container?: string | Element;
  threshold: number;
  layers: SitelenLayer[];
  defaultLayer: SitelenLayer;
  showToggle: boolean;
  toggleMount?: string | Element;
  toggleMode: ToggleMode;
  toggleSize: ToggleSize;
  toggleLabels?: ToggleLabels;
  emojiExcludeSelectors: string[];
  excludeSelectors: string[];
  debug: boolean;
  debugOverlay: boolean;
  diagnosticsOverlay: boolean;
  storageKey: string;
  requireDominantTokiPona: boolean;
  theme: Required<ThemeConfig>;
  detection: Required<DetectionConfig>;
  telemetry: false | TelemetryConfig;
  mutationObserver: Required<Omit<MutationObserverConfig, 'attributeFilter'>> & { attributeFilter?: string[] };
  spaNavigation: Required<SpaNavigationConfig>;
  sitelenPona: Required<SitelenPonaConfig>;
  profileId?: string | null;
  profileMatchReason?: string;
  onProfileMatch?: SitelenLayerPluginConfig['onProfileMatch'];
  onEligibilityChange?: SitelenLayerPluginConfig['onEligibilityChange'];
  onDiagnostics?: SitelenLayerPluginConfig['onDiagnostics'];
  onLayerChange?: SitelenLayerPluginConfig['onLayerChange'];
}

interface TelemetryRecord extends TelemetryEvent {
  retryCount: number;
}

export class SitelenLayerPlugin {
  private readonly config: ResolvedConfig;
  private readonly sitelenPonaClassName: string;
  private readonly initAt = new Date().toISOString();
  private readonly offlineQueueStorageKey = TELEMETRY_QUEUE_KEY;

  private container: Element | null = null;
  private toggleMount: Element | null = null;
  private initialized = false;

  private currentLayer: SitelenLayer = 'latin';
  private preferredLayer: SitelenLayer = 'latin';
  private modeSource: LayerModeSource = 'default';
  private availableLayers: SitelenLayer[] = [];
  private disabledLayers = new Set<SitelenLayer>();

  private textNodes: Text[] = [];
  private originalTextMap = new WeakMap<Text, string>();
  private togglableSet = new Set<Text>();

  private toggle: LayerToggle | null = null;
  private debugOverlay: DebugOverlay | null = null;

  private observer: MutationObserver | null = null;
  private diagnosticsTimer: number | null = null;
  private mutationFlushScheduled = false;
  private queuedMutationRoots = new Set<Node>();
  private requiresFullRefreshFromMutations = false;
  private isApplyingLayer = false;
  private selfMutatedNodes = new WeakSet<Node>();

  private popStateListener: (() => void) | null = null;
  private hashChangeListener: (() => void) | null = null;
  private historyListener: (() => void) | null = null;
  private navigationTimer: number | null = null;
  private layerTransitionTimer: number | null = null;

  private detectorPass = false;
  private eligible = false;
  private totalTokens = 0;
  private recognizedTokens = 0;
  private score = 0;
  private confidence = 0;
  private detectorVersion = 'simple:default:v1';
  private ignoredShortTokens = 0;
  private detectionStrategy: 'simple' | 'weighted' = 'weighted';
  private lexiconProfile: 'default' | 'extended' = 'default';
  private ignoredCandidates = 0;
  private sitelenPonaFontReady = false;
  private sitelenPonaWarning: string | undefined;
  private sitelenPonaApiWarningLogged = false;
  private sitelenPonaReplacementCount = 0;
  private sitelenPonaWordTokenCount = 0;
  private sitelenPonaTopUnmapped: TokenFrequency[] = [];
  private toggleMountMode: 'floating' | 'inline' = 'floating';
  private toggleMountedIn: string | undefined;
  private emojiReplacementCount = 0;
  private emojiWordTokenCount = 0;
  private emojiTopUnmapped: TokenFrequency[] = [];
  private containerInfo = 'body';
  private lastUpdatedAt = new Date(0).toISOString();
  private layerUsage = {
    latin: 0,
    'sitelen-pona': 0,
    'sitelen-emoji': 0
  };
  private layerUsageHistory: Array<{ layer: SitelenLayer; timestamp: string }> = [];
  private totalLayerChanges = 0;
  private unmappedHistory: Record<SitelenLayer, Array<{ token: string; count: number; layer: SitelenLayer; timestamp: string }>> = {
    latin: [],
    'sitelen-pona': [],
    'sitelen-emoji': []
  };
  private telemetryFlushTimer: number | null = null;
  private telemetryRetryTimer: number | null = null;
  private telemetryFlushInProgress = false;
  private telemetryBuffer: TelemetryRecord[] = [];
  private telemetryOnlineListener: (() => void) | null = null;
  private lastTelemetryDispatch = 0;
  private lastTelemetryIdSuffix = 0;

  private initialLayerResolved = false;
  private observerStats: ObserverStats = {
    mutationsObserved: 0,
    batchesProcessed: 0,
    incrementalUpdates: 0,
    fullRefreshes: 0
  };

  constructor(config: SitelenLayerPluginConfig = {}) {
    const validatedLayers = (config.layers ?? DEFAULT_LAYERS).filter(isValidLayer);
    const sitelenPona = defaultSitelenPonaConfig(config.sitelenPona);
    const baseTheme = defaultThemeConfig();
    const theme: Required<ThemeConfig> = {
      transition: config.theme?.transition ?? baseTheme.transition,
      customCssVars: {
        ...baseTheme.customCssVars,
        ...(config.theme?.customCssVars ?? {})
      }
    };
    const detection = {
      ...defaultDetectionConfig(config),
      rareTokenPenalty: defaultDetectionConfig(config).rareTokenPenalty ?? 0
    };
    const telemetry = defaultTelemetryConfig(config);

    const baseLayers = validatedLayers.length > 0 ? validatedLayers : DEFAULT_LAYERS;
    const layers = sitelenPona.enabled ? baseLayers : baseLayers.filter((layer) => layer !== 'sitelen-pona');

    this.config = {
      container: config.container,
      threshold: config.threshold ?? 0.7,
      layers: layers.length > 0 ? layers : ['latin', 'sitelen-emoji'],
      defaultLayer: isValidLayer(config.defaultLayer) ? config.defaultLayer : 'latin',
      showToggle: config.showToggle ?? true,
      toggleMount: config.toggleMount,
      toggleMode: config.toggleMode ?? DEFAULT_TOGGLE_MODE,
      toggleSize: isValidToggleSize(config.toggleSize) ? config.toggleSize : DEFAULT_TOGGLE_SIZE,
      toggleLabels: config.toggleLabels,
      emojiExcludeSelectors: config.emojiExcludeSelectors ?? [],
      excludeSelectors: config.excludeSelectors ?? [],
      debug: config.debug ?? false,
      debugOverlay: config.debugOverlay ?? false,
      diagnosticsOverlay: config.diagnosticsOverlay ?? false,
      storageKey: config.storageKey ?? DEFAULT_STORAGE_KEY,
      requireDominantTokiPona: config.requireDominantTokiPona ?? true,
      theme,
      detection: {
        strategy: detection.strategy,
        lexiconProfile: detection.lexiconProfile,
        minTokens: detection.minTokens,
        rareTokenPenalty: detection.rareTokenPenalty
      },
      telemetry,
      mutationObserver: defaultMutationObserverConfig(config),
      spaNavigation: defaultSpaNavigationConfig(config),
      sitelenPona,
      profileId: config.profileId,
      profileMatchReason: config.profileMatchReason,
      onProfileMatch: config.onProfileMatch,
      onEligibilityChange: config.onEligibilityChange,
      onDiagnostics: config.onDiagnostics,
      onLayerChange: config.onLayerChange
    };

    if (!this.config.layers.includes(this.config.defaultLayer)) {
      this.config.defaultLayer = this.config.layers[0] ?? 'latin';
    }

    this.preferredLayer = this.config.defaultLayer;
    this.sitelenPonaClassName = getSitelenPonaClassName(this.config.sitelenPona.className);
  }

  init(): void {
    if (this.initialized) {
      return;
    }

    this.container = resolveElement(this.config.container) ?? document.body;
    this.toggleMount = resolveElement(this.config.toggleMount);
    this.toggleMountedIn = describeElement(this.toggleMount ?? this.config.toggleMount);
    this.toggleMountMode = this.resolveToggleMountMode();

    if (!this.container) {
      this.warnDebug('container not found; plugin init skipped');
      return;
    }

    if ((this.config.toggleMode === 'inline' || (this.config.toggleMode === 'auto' && this.config.toggleMount)) && !this.toggleMount) {
      this.warnDebug('toggleMount target was not found; falling back to floating mode');
    }

    this.applyThemeVars();
    this.flushTelemetryQueue();
    this.installTelemetryOnlineObserver();

    if (this.config.sitelenPona.enabled) {
      ensureFontCssLink(this.config.sitelenPona.fontCssUrl || undefined);
      applySitelenPonaVariables(this.container, this.config.sitelenPona);
    }

    if (this.config.debug || this.config.debugOverlay || this.config.diagnosticsOverlay) {
      this.showDiagnosticsOverlay();
    }

    this.config.onProfileMatch?.(this.config.profileId ?? null);
    if (this.config.debug) {
      // eslint-disable-next-line no-console
      console.info(
        '[sitelen-layer-plugin] profile match',
        this.config.profileId
          ? `${this.config.profileId} (${this.config.profileMatchReason ?? 'matched'})`
          : this.config.profileMatchReason ?? 'none'
      );
    }

    this.refresh();

    this.recordTelemetryEvent('init', {
      threshold: this.config.threshold,
      strategy: this.config.detection.strategy,
      lexiconProfile: this.config.detection.lexiconProfile,
      layer: this.currentLayer
    });

    if (this.config.mutationObserver.enabled) {
      this.startObserving();
    }

    if (this.config.spaNavigation.enabled) {
      this.startNavigationObservation();
    }

    this.initialized = true;
  }

  refresh(): void {
    if (!this.container) {
      this.container = resolveElement(this.config.container) ?? document.body;
      if (!this.container) {
        this.warnDebug('container not found during refresh');
        return;
      }
    }

    this.toggleMount = resolveElement(this.config.toggleMount);
    this.toggleMountedIn = describeElement(this.toggleMount ?? this.config.toggleMount);
    this.toggleMountMode = this.resolveToggleMountMode();

    this.observerStats.fullRefreshes += 1;
    this.performFullRefresh();
  }

  destroy(): void {
    this.stopObserving();
    this.stopNavigationObservation();
    this.destroyToggle();
    this.applyLayer('latin', 'default', false);
    this.stopLayerTransition();

    if (this.container) {
      clearSitelenPonaVariables(this.container, this.config.sitelenPona.applyToRoot);
    }

    if (this.telemetryFlushTimer !== null) {
      window.clearTimeout(this.telemetryFlushTimer);
      this.telemetryFlushTimer = null;
    }

    if (this.telemetryRetryTimer !== null) {
      window.clearTimeout(this.telemetryRetryTimer);
      this.telemetryRetryTimer = null;
    }

    this.hideDiagnosticsOverlay();
    this.uninstallTelemetryOnlineObserver();
    this.flushTelemetryNow();
    this.initialized = false;
  }

  getDiagnostics(): PluginDiagnostics {
    return {
      totalTokens: this.totalTokens,
      recognizedTokens: this.recognizedTokens,
      score: this.score,
      confidence: this.confidence,
      detectorVersion: this.detectorVersion,
      detectionStrategy: this.detectionStrategy,
      ignoredShortTokens: this.ignoredShortTokens,
      lexiconProfile: this.lexiconProfile,
      pass: this.detectorPass,
      threshold: this.config.threshold,
      eligible: this.eligible,
      activeLayer: this.currentLayer,
      containerInfo: this.containerInfo,
      modeSource: this.modeSource,
      availableLayers: [...this.availableLayers],
      ignoredCandidates: this.ignoredCandidates,
      sitelenPonaFontReady: this.sitelenPonaFontReady,
      sitelenPonaRenderMode: this.config.sitelenPona.renderStrategy,
      sitelenPonaTextRewrite: this.config.sitelenPona.renderStrategy === 'transform',
      sitelenPonaReplacementCount: this.config.sitelenPona.renderStrategy === 'transform' ? this.sitelenPonaReplacementCount : 0,
      sitelenPonaWordTokenCount: this.config.sitelenPona.renderStrategy === 'transform' ? this.sitelenPonaWordTokenCount : 0,
      sitelenPonaCoverageRatio:
        this.config.sitelenPona.renderStrategy === 'transform' && this.sitelenPonaWordTokenCount > 0
          ? this.sitelenPonaReplacementCount / this.sitelenPonaWordTokenCount
          : null,
      sitelenPonaTopUnmapped: this.config.sitelenPona.renderStrategy === 'transform' ? [...this.sitelenPonaTopUnmapped] : [],
      sitelenPonaWarning: this.sitelenPonaWarning,
      toggleMountMode: this.toggleMountMode,
      toggleSize: this.config.toggleSize,
      toggleMountedIn: this.toggleMountedIn,
      emojiReplacementCount: this.emojiReplacementCount,
      emojiCoverageRatio: this.emojiWordTokenCount > 0 ? this.emojiReplacementCount / this.emojiWordTokenCount : 0,
      emojiTopUnmapped: [...this.emojiTopUnmapped],
      matchedProfileId: this.config.profileId ?? null,
      matchedProfileReason: this.config.profileMatchReason,
      profileId: this.config.profileId,
      lastUpdatedAt: this.lastUpdatedAt,
      observerStats: { ...this.observerStats }
    };
  }

  getConfig(): Readonly<ResolvedConfig> {
    return this.config;
  }

  getLayerUsageSnapshot(options?: LayerUsageSnapshotOptions): LayerUsageSnapshot {
    const since = options?.since;
    const timeWindowMs = options?.timeWindowMs;
    const maxEntries = options?.maxEntries;
    const totalSwitches = options ? this.getFilteredLayerUsageEntries({ since, timeWindowMs, maxEntries }).length : this.totalLayerChanges;
    const countsByLayer =
      options?.since || options?.timeWindowMs || options?.maxEntries != null
        ? this.getLayerUsageFromEntries(this.getFilteredLayerUsageEntries({ since, timeWindowMs, maxEntries }))
        : { ...this.layerUsage };

    return {
      countsByLayer,
      totalSwitches,
      activeLayer: this.currentLayer,
      collectedAt: new Date().toISOString(),
      windowSeconds: typeof timeWindowMs === 'number' ? Math.round(timeWindowMs / 1000) : undefined
    };
  }

  getUnmappedSnapshot(options?: UnmappedSnapshotOptions): UnmappedSnapshot {
    const layer = options?.layer ?? 'sitelen-emoji';
    const limit = options?.limit ?? TOP_UNMAPPED_LIMIT;
    const since = options?.since;
    const records = this.unmappedHistory[layer] ?? [];

    const filtered = since
      ? records.filter((record) => !since || record.timestamp >= since)
      : records;

    const merged = this.toTopUnmapped(recordsToFrequency(filtered));
    return {
      layer,
      tokens: merged.slice(0, limit),
      since,
      generatedAt: new Date().toISOString()
    };
  }

  renderUsageDashboard(container: Element | string, options?: LayerUsageSnapshotOptions): void {
    const containerElement = resolveElement(container) ?? null;
    if (!containerElement) {
      this.warnDebug('renderUsageDashboard container not found');
      return;
    }

    const snapshot = this.getLayerUsageSnapshot(options);
    const root = document.createElement('div');
    root.className = 'slp-layer-usage-dashboard';
    const total = Math.max(1, snapshot.totalSwitches);

    const latin = snapshot.countsByLayer.latin;
    const sitelenPona = snapshot.countsByLayer['sitelen-pona'];
    const sitelenEmoji = snapshot.countsByLayer['sitelen-emoji'];

    root.textContent = `Layer usage snapshot\nlatin: ${latin} (${Math.round((latin / total) * 100)}%)\nsitelen-pona: ${sitelenPona} (${Math.round((sitelenPona / total) * 100)}%)\nsitelen-emoji: ${sitelenEmoji} (${Math.round((sitelenEmoji / total) * 100)}%)`;
    root.setAttribute('data-sitelen-layer-ui', 'usage-dashboard');
    root.style.cssText =
      'position: fixed; right: 16px; top: 16px; z-index: 2147483600; padding: 8px; background: rgba(12,12,12,0.88); color: #f4f6ff; border-radius: 10px; font-size: 11px; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;';
    containerElement.appendChild(root);
  }

  private getFilteredLayerUsageEntries(options: {
    since?: string;
    timeWindowMs?: number;
    maxEntries?: number;
  }): Array<{ layer: SitelenLayer; timestamp: string }> {
    const timeWindowMs = options.timeWindowMs;
    const sinceTs = options.since ? Date.parse(options.since) : null;
    if (sinceTs != null && Number.isNaN(sinceTs)) {
      return [];
    }

    let records = [...this.layerUsageHistory];

    if (sinceTs != null) {
      records = records.filter((entry) => Date.parse(entry.timestamp) >= sinceTs);
    }

    if (timeWindowMs != null && timeWindowMs > 0) {
      const cutoff = Date.now() - timeWindowMs;
      records = records.filter((entry) => Date.parse(entry.timestamp) >= cutoff);
    }

    if (options.maxEntries != null) {
      records = records.slice(-Math.max(1, options.maxEntries));
    }

    return records;
  }

  private getLayerUsageFromEntries(records: Array<{ layer: SitelenLayer }>): Record<SitelenLayer, number> {
    const countsByLayer: Record<SitelenLayer, number> = {
      latin: 0,
      'sitelen-pona': 0,
      'sitelen-emoji': 0
    };

    records.forEach((record) => {
      countsByLayer[record.layer] = (countsByLayer[record.layer] ?? 0) + 1;
    });

    return countsByLayer;
  }

  showDiagnosticsOverlay(): void {
    if (!this.debugOverlay) {
      this.debugOverlay = new DebugOverlay();
    }

    this.debugOverlay.mount();
    this.debugOverlay.update(this.getDiagnostics());
  }

  hideDiagnosticsOverlay(): void {
    if (!this.debugOverlay) {
      return;
    }

    this.debugOverlay.destroy();
    this.debugOverlay = null;
  }

  private performFullRefresh(): void {
    if (!this.container) {
      return;
    }

    this.withObserverPaused(() => {
      if (this.textNodes.length > 0) {
        this.isApplyingLayer = true;
        try {
          this.restoreLatinText(this.textNodes);
        } finally {
          this.isApplyingLayer = false;
        }
      }
    });

    this.containerInfo = describeContainer(this.container, this.config.container);
    const previousEligibility = this.eligible;

    const collection = collectTextNodes(this.container, this.config.excludeSelectors);
    this.textNodes = collection.textNodes;
    this.ignoredCandidates = collection.ignoredCandidates;

    this.syncTextNodesWithOriginals(this.textNodes, true);
    this.updateEmojiCoverageStats(this.textNodes);
    if (this.config.sitelenPona.renderStrategy === 'transform') {
      this.updateSitelenPonaCoverageStats(this.textNodes);
    } else {
      this.sitelenPonaReplacementCount = 0;
      this.sitelenPonaWordTokenCount = 0;
      this.sitelenPonaTopUnmapped = [];
    }

    const textForDetection = this.textNodes.map((node) => this.originalTextMap.get(node) ?? '').join(' ');
    const detectorResult = analyzeTokiPonaDominance(textForDetection, {
      threshold: this.config.threshold,
      strategy: this.config.detection.strategy,
      lexiconProfile: this.config.detection.lexiconProfile,
      minTokens: this.config.detection.minTokens,
      rareTokenPenalty: this.config.detection.rareTokenPenalty
    });

    this.totalTokens = detectorResult.totalTokens;
    this.recognizedTokens = detectorResult.recognizedTokens;
    this.confidence = detectorResult.confidence;
    this.score = detectorResult.score;
    this.detectorVersion = detectorResult.detectorVersion;
    this.ignoredShortTokens = detectorResult.ignoredShortTokens;
    this.detectionStrategy = this.config.detection.strategy;
    this.lexiconProfile = this.config.detection.lexiconProfile;
    this.detectorPass = detectorResult.pass;

    this.eligible = resolveEligibility(detectorResult.pass, this.config.requireDominantTokiPona);
    this.updateLayerAvailability();

    if (this.totalTokens < this.config.detection.minTokens) {
      this.warnDebug('detector has low token count; confidence may be weak');
    }

    if (
      this.config.sitelenPona.renderStrategy === 'transform' &&
      this.sitelenPonaWordTokenCount > 0 &&
      this.sitelenPonaReplacementCount / this.sitelenPonaWordTokenCount < 0.35
    ) {
      this.warnDebug('sitelen-pona transform coverage is low for this container; many tokens are unmapped in MVP subset');
    }

    if (this.config.profileId && !this.eligible) {
      this.warnDebug(`profile matched (${this.config.profileId}), but eligibility failed`);
    }

    if (!this.eligible) {
      this.destroyToggle();
      this.applyLayer('latin', 'forced-latin-ineligible');
    } else {
      if (this.config.showToggle) {
        this.ensureToggle();
      }

      const layerToApply = this.resolveNextLayer();
      this.applyLayer(layerToApply.layer, layerToApply.source);
    }

    this.lastUpdatedAt = new Date().toISOString();
    this.recordTelemetryEvent('perform_full_refresh', {
      layer: this.currentLayer,
      score: this.score,
      eligible: this.eligible
    });
    this.publishDiagnostics(previousEligibility !== this.eligible);
  }

  private ensureLayerUsage(layer: SitelenLayer): void {
    this.layerUsage[layer] = (this.layerUsage[layer] ?? 0) + 1;
  }

  private recordLayerUsage(layer: SitelenLayer): void {
    this.ensureLayerUsage(layer);
    this.totalLayerChanges += 1;
    this.layerUsageHistory.push({
      layer,
      timestamp: new Date().toISOString()
    });

    if (this.layerUsageHistory.length > LAYER_USAGE_HISTORY_LIMIT) {
      this.layerUsageHistory = this.layerUsageHistory.slice(-LAYER_USAGE_HISTORY_LIMIT);
    }
  }

  private resolveNextLayer(): { layer: SitelenLayer; source: LayerModeSource } {
    if (!this.initialLayerResolved) {
      this.initialLayerResolved = true;
      const stored = readStoredLayer(this.config.storageKey);

      if (stored && this.config.layers.includes(stored)) {
        this.preferredLayer = stored;
        return { layer: stored, source: 'storage' };
      }

      this.preferredLayer = this.config.defaultLayer;
      return {
        layer: this.config.defaultLayer,
        source: this.config.profileId ? 'profile' : 'default'
      };
    }

    return { layer: this.preferredLayer, source: this.modeSource };
  }

  private publishDiagnostics(eligibilityChanged: boolean): void {
    const diagnostics = this.getDiagnostics();

    if (eligibilityChanged) {
      this.config.onEligibilityChange?.(this.eligible, diagnostics);
      this.recordTelemetryEvent('eligibility_change', {
        eligible: this.eligible,
        score: this.score,
        confidence: this.confidence,
        totalTokens: this.totalTokens
      });
    }

    this.recordTelemetryEvent('diagnostics', {
      layer: this.currentLayer,
      score: this.score,
      confidence: this.confidence,
      eligible: this.eligible,
      totalTokens: this.totalTokens,
      activeLayer: this.currentLayer
    });

    this.config.onDiagnostics?.(diagnostics);
    this.debugOverlay?.update(diagnostics);

    if (this.config.debug) {
      // eslint-disable-next-line no-console
      console.info('[sitelen-layer-plugin] diagnostics', diagnostics);
    }
  }

  private ensureToggle(): void {
    const expectedMountMode = this.resolveToggleMountMode();
    if (this.toggle) {
      if (this.toggle.getMountedMode() !== expectedMountMode) {
        this.toggle.destroy();
        this.toggle = null;
      } else {
        this.toggleMountMode = expectedMountMode;
      }
    }

    if (this.toggle) {
      this.toggle.setDisabledLayers(Array.from(this.disabledLayers));
      this.toggle.setActiveLayer(this.currentLayer);
      return;
    }

    this.toggle = new LayerToggle({
      layers: this.config.layers,
      activeLayer: this.currentLayer,
      disabledLayers: Array.from(this.disabledLayers),
      mount: this.toggleMount ?? undefined,
      mode: this.config.toggleMode,
      size: this.config.toggleSize,
      mountedIn: this.toggleMountedIn,
      labels: this.config.toggleLabels,
      transition: this.config.theme.transition,
      onChange: (layer) => {
        const appliedLayer = this.applyLayer(layer, 'default');
        this.preferredLayer = appliedLayer;
        writeStoredLayer(this.config.storageKey, appliedLayer);
      }
    });

    this.toggle.mount();
    this.toggleMountMode = this.toggle.getMountedMode();
  }

  private destroyToggle(): void {
    if (!this.toggle) {
      return;
    }

    this.toggle.destroy();
    this.toggle = null;
  }

  private applyLayer(layer: SitelenLayer, modeSource: LayerModeSource = 'default', emitLayerChange = true): SitelenLayer {
    if (!this.container) {
      return 'latin';
    }
    const container = this.container;

    let effectiveLayer = layer;
    if (!this.isLayerEnabled(layer)) {
      effectiveLayer = 'latin';
      modeSource = layer === 'sitelen-pona' ? 'fallback-font-missing' : modeSource;
    }

    if (this.currentLayer !== effectiveLayer) {
      this.applyLayerTransition();
    }

    this.withObserverPaused(() => {
      this.isApplyingLayer = true;
      try {
        this.restoreLatinText(this.textNodes);

        if (effectiveLayer === 'sitelen-emoji') {
          this.applyEmojiLayer(this.textNodes);
        } else if (effectiveLayer === 'sitelen-pona' && this.config.sitelenPona.renderStrategy === 'transform') {
          this.applySitelenPonaTransformLayer(this.textNodes, this.config.sitelenPona.transformStrategy);
        }

        applyContainerLayerClass(container, effectiveLayer, this.sitelenPonaClassName);
      } finally {
        this.isApplyingLayer = false;
      }
    });

    this.currentLayer = effectiveLayer;
    this.modeSource = modeSource;
    this.toggle?.setActiveLayer(effectiveLayer);
    this.lastUpdatedAt = new Date().toISOString();
    this.recordLayerUsage(effectiveLayer);

    const diagnostics = this.getDiagnostics();
    this.config.onDiagnostics?.(diagnostics);
    this.debugOverlay?.update(diagnostics);

    this.scheduleSitelenPonaFontDiagnostics(effectiveLayer);

    if (emitLayerChange) {
      this.config.onLayerChange?.(effectiveLayer, diagnostics);
      this.recordTelemetryEvent('layer_change', {
        layer: effectiveLayer,
        modeSource,
        eligible: this.eligible,
        tokenCount: this.totalTokens,
        score: this.score
      });
    }

    return effectiveLayer;
  }

  private restoreLatinText(nodes: Text[]): void {
    nodes.forEach((node) => {
      const original = this.originalTextMap.get(node);
      if (typeof original === 'string' && node.nodeValue !== original) {
        this.setTextNodeValue(node, original);
      }
    });
  }

  private applyEmojiLayer(nodes: Text[]): void {
    this.emojiReplacementCount = 0;
    this.emojiWordTokenCount = 0;
    const unmappedCounts: Record<string, number> = {};

    nodes.forEach((node) => {
      if (this.isEmojiExcludedNode(node)) {
        return;
      }

      const source = this.originalTextMap.get(node);
      if (typeof source === 'string') {
        const result = toSitelenEmojiWithStats(source);
        this.emojiReplacementCount += result.replacedTokens;
        this.emojiWordTokenCount += result.wordTokens;
        this.mergeTokenCounts(unmappedCounts, result.unmappedWordCounts);
        const transformed = result.text;
        if (node.nodeValue !== transformed) {
          this.setTextNodeValue(node, transformed);
        }
      }
    });

    this.emojiTopUnmapped = this.toTopUnmapped(unmappedCounts);
    this.pushUnmappedSnapshot('sitelen-emoji', this.emojiTopUnmapped);
  }

  private applySitelenPonaTransformLayer(
    nodes: Text[],
    strategy: SitelenPonaConfig['transformStrategy'] = 'mvp'
  ): void {
    if (strategy === 'rules') {
      this.applySitelenPonaTransformLayer(nodes, 'mvp');
      return;
    }

    if (strategy === 'api' && !this.config.sitelenPona.transformerEndpoint) {
      if (!this.sitelenPonaApiWarningLogged) {
        this.sitelenPonaWarning =
          'sitelen-pona transform API strategy is enabled, but transformerEndpoint is not set. Fallback to local MVP mapping.';
        this.warnDebug(this.sitelenPonaWarning);
        this.sitelenPonaApiWarningLogged = true;
      }
      
      this.sitelenPonaWarning =
        'sitelen-pona transform API strategy is configured without endpoint; fallback to local MVP mapping.';
    }

    if (strategy === 'api' && this.config.sitelenPona.transformerEndpoint && !this.sitelenPonaApiWarningLogged) {
      this.sitelenPonaWarning =
        'sitelen-pona transform API strategy is currently a future extension point and is not implemented yet. Using local MVP mapping.';
      this.warnDebug(this.sitelenPonaWarning);
      this.sitelenPonaApiWarningLogged = true;
    }

    if (strategy === 'api') {
      strategy = 'mvp';
    }

    this.sitelenPonaReplacementCount = 0;
    this.sitelenPonaWordTokenCount = 0;
    const unmappedCounts: Record<string, number> = {};

    nodes.forEach((node) => {
      const source = this.originalTextMap.get(node);
      if (typeof source === 'string') {
        const result = toSitelenPonaWithStats(source);
        this.sitelenPonaReplacementCount += result.replacedTokens;
        this.sitelenPonaWordTokenCount += result.wordTokens;
        this.mergeTokenCounts(unmappedCounts, result.unmappedWordCounts);
        if (node.nodeValue !== result.text) {
          this.setTextNodeValue(node, result.text);
        }
      }
    });

    this.sitelenPonaTopUnmapped = this.toTopUnmapped(unmappedCounts);
    this.pushUnmappedSnapshot('sitelen-pona', this.sitelenPonaTopUnmapped);
  }

  private setTextNodeValue(node: Text, value: string): void {
    this.selfMutatedNodes.add(node);
    node.nodeValue = value;
  }

  private syncTextNodesWithOriginals(nodes: Text[], overwriteExisting: boolean): void {
    this.togglableSet = new Set(nodes);

    nodes.forEach((node) => {
      const current = node.nodeValue ?? '';

      if (!this.originalTextMap.has(node) || overwriteExisting) {
        this.originalTextMap.set(node, current);
      }
    });
  }

  private updateLayerAvailability(): void {
    this.disabledLayers.clear();

    this.sitelenPonaFontReady = false;
    this.sitelenPonaWarning = undefined;

    if (this.config.sitelenPona.enabled) {
      this.sitelenPonaFontReady = isSitelenPonaFontReady(this.config.sitelenPona.fontFamily);

      if (this.config.sitelenPona.renderStrategy === 'ligature-font') {
        this.sitelenPonaWarning = this.sitelenPonaFontReady
          ? 'sitelen-pona ligature-font mode keeps latin text and relies on a ligature-capable sitelen pona font.'
          : 'sitelen-pona ligature-font mode is active, but the configured font is not detected yet. Load a ligature-capable sitelen pona font.';
        this.warnDebug(this.sitelenPonaWarning);
      } else if (this.config.sitelenPona.renderStrategy === 'font-only') {
        this.sitelenPonaWarning = this.sitelenPonaFontReady
          ? 'sitelen-pona font-only mode is a legacy alias for ligature-font mode and does not rewrite text.'
          : 'sitelen-pona font-only mode is active, but the configured font is not detected yet. Load a ligature-capable sitelen pona font.';
        this.warnDebug(this.sitelenPonaWarning);
      } else if (this.config.sitelenPona.renderStrategy === 'transform') {
        this.sitelenPonaWarning =
          'sitelen-pona transform mode is experimental and rewrites text with an MVP subset. Prefer ligature-font for real glyph rendering.';
        this.warnDebug(this.sitelenPonaWarning);
      }
    }

    this.availableLayers = this.config.layers.filter((layer) => !this.disabledLayers.has(layer));

    if (!this.availableLayers.includes('latin')) {
      this.availableLayers.unshift('latin');
    }

    if (this.toggle) {
      this.toggle.setDisabledLayers(Array.from(this.disabledLayers));
    }
  }

  private scheduleSitelenPonaFontDiagnostics(layer: SitelenLayer): void {
    if (
      layer !== 'sitelen-pona' ||
      !this.config.sitelenPona.enabled ||
      this.config.sitelenPona.renderStrategy === 'transform' ||
      !('fonts' in document) ||
      !document.fonts
    ) {
      return;
    }

    void document.fonts.ready.then(() => {
      if (this.currentLayer !== 'sitelen-pona') {
        return;
      }

      this.sitelenPonaFontReady = isSitelenPonaFontReady(this.config.sitelenPona.fontFamily);
      this.sitelenPonaWarning = this.sitelenPonaFontReady
        ? `sitelen-pona ${this.config.sitelenPona.renderStrategy} mode keeps latin text and relies on a ligature-capable sitelen pona font.`
        : `sitelen-pona ${this.config.sitelenPona.renderStrategy} mode is active, but the configured font is not detected yet. Load a ligature-capable sitelen pona font.`;
      this.lastUpdatedAt = new Date().toISOString();

      const diagnostics = this.getDiagnostics();
      this.config.onDiagnostics?.(diagnostics);
      this.debugOverlay?.update(diagnostics);
    });
  }

  private isLayerEnabled(layer: SitelenLayer): boolean {
    return this.availableLayers.includes(layer);
  }

  private resolveToggleMountMode(): 'floating' | 'inline' {
    const mode = this.config.toggleMode;
    if (mode === 'floating') {
      return 'floating';
    }

    if (mode === 'inline') {
      return this.toggleMount ? 'inline' : 'floating';
    }

    return this.toggleMount ? 'inline' : 'floating';
  }

  private isEmojiExcludedNode(node: Text): boolean {
    if (this.config.emojiExcludeSelectors.length === 0) {
      return false;
    }

    const element = node.parentElement;
    if (!element) {
      return false;
    }

    return this.config.emojiExcludeSelectors.some((selector) => {
      try {
        return Boolean(element.closest(selector));
      } catch {
        return false;
      }
    });
  }

  private updateEmojiCoverageStats(nodes: Text[]): void {
    let replacedTokens = 0;
    let wordTokens = 0;
    const unmappedCounts: Record<string, number> = {};

    nodes.forEach((node) => {
      if (this.isEmojiExcludedNode(node)) {
        return;
      }

      const source = this.originalTextMap.get(node);
      if (typeof source !== 'string') {
        return;
      }

      const stats = toSitelenEmojiWithStats(source);
      replacedTokens += stats.replacedTokens;
      wordTokens += stats.wordTokens;
      this.mergeTokenCounts(unmappedCounts, stats.unmappedWordCounts);
    });

    this.emojiReplacementCount = replacedTokens;
    this.emojiWordTokenCount = wordTokens;
    this.emojiTopUnmapped = this.toTopUnmapped(unmappedCounts);
    this.pushUnmappedSnapshot('sitelen-emoji', this.emojiTopUnmapped);
  }

  private updateSitelenPonaCoverageStats(nodes: Text[]): void {
    let replacedTokens = 0;
    let wordTokens = 0;
    const unmappedCounts: Record<string, number> = {};

    nodes.forEach((node) => {
      const source = this.originalTextMap.get(node);
      if (typeof source !== 'string') {
        return;
      }

      const stats = toSitelenPonaWithStats(source);
      replacedTokens += stats.replacedTokens;
      wordTokens += stats.wordTokens;
      this.mergeTokenCounts(unmappedCounts, stats.unmappedWordCounts);
    });

    this.sitelenPonaReplacementCount = replacedTokens;
    this.sitelenPonaWordTokenCount = wordTokens;
    this.sitelenPonaTopUnmapped = this.toTopUnmapped(unmappedCounts);
    this.pushUnmappedSnapshot('sitelen-pona', this.sitelenPonaTopUnmapped);
  }

  private mergeTokenCounts(target: Record<string, number>, source: Record<string, number>): void {
    Object.entries(source).forEach(([token, count]) => {
      if (!token || token.trim().length === 0 || count <= 0) {
        return;
      }

      target[token] = (target[token] ?? 0) + count;
    });
  }

  private toTopUnmapped(freqMap: Record<string, number>): TokenFrequency[] {
    return Object.entries(freqMap)
      .filter(([token, count]) => token.trim().length > 0 && count > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TOP_UNMAPPED_LIMIT)
      .map(([token, count]) => ({ token, count }));
  }

  private startObserving(): void {
    if (!this.container || this.observer) {
      return;
    }

    this.observer = new MutationObserver((records) => this.onMutations(records));
    this.observeCurrentContainer();
  }

  private observeCurrentContainer(): void {
    if (!this.container || !this.observer) {
      return;
    }

    this.observer.observe(this.container, {
      subtree: true,
      characterData: true,
      childList: true,
      attributes: this.config.mutationObserver.observeAttributes,
      attributeFilter: this.config.mutationObserver.attributeFilter
    });
  }

  private withObserverPaused<T>(operation: () => T): T {
    const shouldResume = Boolean(this.observer && this.container);
    if (shouldResume) {
      this.observer?.disconnect();
    }

    try {
      return operation();
    } finally {
      if (shouldResume) {
        this.observeCurrentContainer();
      }
    }
  }

  private onMutations(records: MutationRecord[]): void {
    if (!this.container) {
      return;
    }

    let relevant = false;

    records.forEach((record) => {
      if (this.shouldIgnoreMutation(record)) {
        return;
      }

      relevant = true;
      this.observerStats.mutationsObserved += 1;
      this.observerStats.lastMutationAt = new Date().toISOString();

      if (record.type === 'childList') {
        if (record.removedNodes.length > 0) {
          this.requiresFullRefreshFromMutations = true;
        }

        record.addedNodes.forEach((node) => this.queuedMutationRoots.add(node));

        if (this.queuedMutationRoots.size > this.config.mutationObserver.maxBatchNodes) {
          this.requiresFullRefreshFromMutations = true;
        }
      }

      if (record.type === 'characterData') {
        this.queuedMutationRoots.add(record.target);
      }

      if (record.type === 'attributes') {
        this.queuedMutationRoots.add(record.target);
      }
    });

    if (!relevant) {
      return;
    }

    this.scheduleMutationFlush();
    this.scheduleDiagnosticsRefresh();
  }

  private shouldIgnoreMutation(record: MutationRecord): boolean {
    if (this.isApplyingLayer) {
      return true;
    }

    const target = record.target;
    if (!this.container) {
      return true;
    }

    if (this.isInsidePluginUi(target)) {
      return true;
    }

    if (record.type === 'characterData' && this.selfMutatedNodes.has(target)) {
      this.selfMutatedNodes.delete(target);
      return true;
    }

    if (!this.container.contains(target)) {
      return true;
    }

    return false;
  }

  private isInsidePluginUi(node: Node): boolean {
    if (node instanceof Element) {
      return Boolean(node.closest(PLUGIN_UI_SELECTOR));
    }

    return Boolean(node.parentElement?.closest(PLUGIN_UI_SELECTOR));
  }

  private scheduleMutationFlush(): void {
    if (this.mutationFlushScheduled) {
      return;
    }

    this.mutationFlushScheduled = true;
    window.requestAnimationFrame(() => {
      this.mutationFlushScheduled = false;
      this.flushMutationBatch();
    });
  }

  private flushMutationBatch(): void {
    if (!this.container) {
      this.queuedMutationRoots.clear();
      return;
    }

    this.observerStats.batchesProcessed += 1;

    if (this.requiresFullRefreshFromMutations || !this.config.mutationObserver.incremental) {
      this.requiresFullRefreshFromMutations = false;
      this.queuedMutationRoots.clear();
      return;
    }

    const roots = Array.from(this.queuedMutationRoots);
    this.queuedMutationRoots.clear();

    if (roots.length === 0) {
      return;
    }

    this.applyIncrementalMutationUpdates(roots);
  }

  private applyIncrementalMutationUpdates(roots: Node[]): void {
    if (!this.container) {
      return;
    }

    const newNodes = new Set<Text>();

    roots.forEach((root) => {
      if (root instanceof Text) {
        if (root.isConnected && isTextNodeAllowed(root, this.config.excludeSelectors) && this.container?.contains(root)) {
          newNodes.add(root);
        }

        return;
      }

      if (root instanceof Element || root instanceof DocumentFragment) {
        const collection = collectTextNodesInSubtree(root, this.config.excludeSelectors);
        collection.textNodes.forEach((node) => {
          if (this.container?.contains(node)) {
            newNodes.add(node);
          }
        });
      }
    });

    this.textNodes = this.textNodes.filter((node) => node.isConnected && this.container?.contains(node));

    let updatedCount = 0;
    newNodes.forEach((node) => {
      if (!this.togglableSet.has(node)) {
        this.textNodes.push(node);
        this.togglableSet.add(node);
      }

      const latest = node.nodeValue ?? '';
      this.originalTextMap.set(node, latest);
      updatedCount += 1;
    });

    if (this.currentLayer === 'sitelen-emoji' && this.eligible && updatedCount > 0) {
      this.isApplyingLayer = true;
      try {
        newNodes.forEach((node) => {
          if (this.isEmojiExcludedNode(node)) {
            return;
          }

          const source = this.originalTextMap.get(node);
          if (typeof source === 'string') {
            const result = toSitelenEmojiWithStats(source);
            this.emojiReplacementCount += result.replacedTokens;
            this.emojiWordTokenCount += result.wordTokens;
            const transformed = result.text;
            if (node.nodeValue !== transformed) {
              this.setTextNodeValue(node, transformed);
            }
          }
        });
      } finally {
        this.isApplyingLayer = false;
      }
    }

    if (
      this.currentLayer === 'sitelen-pona' &&
      this.config.sitelenPona.renderStrategy === 'transform' &&
      this.eligible &&
      updatedCount > 0
    ) {
      this.isApplyingLayer = true;
      try {
        newNodes.forEach((node) => {
          const source = this.originalTextMap.get(node);
          if (typeof source !== 'string') {
            return;
          }

          const result = toSitelenPonaWithStats(source);
          this.sitelenPonaReplacementCount += result.replacedTokens;
          this.sitelenPonaWordTokenCount += result.wordTokens;
          if (node.nodeValue !== result.text) {
            this.setTextNodeValue(node, result.text);
          }
        });
      } finally {
        this.isApplyingLayer = false;
      }
    }

    this.observerStats.incrementalUpdates += updatedCount;
    this.lastUpdatedAt = new Date().toISOString();
    this.updateEmojiCoverageStats(this.textNodes);
    if (this.config.sitelenPona.renderStrategy === 'transform') {
      this.updateSitelenPonaCoverageStats(this.textNodes);
    }

    const diagnostics = this.getDiagnostics();
    this.config.onDiagnostics?.(diagnostics);
    this.debugOverlay?.update(diagnostics);
  }

  private scheduleDiagnosticsRefresh(): void {
    if (this.diagnosticsTimer !== null) {
      window.clearTimeout(this.diagnosticsTimer);
    }

    this.diagnosticsTimer = window.setTimeout(() => {
      this.diagnosticsTimer = null;
      this.refresh();
    }, this.config.mutationObserver.debounceMs);
  }

  private stopObserving(): void {
    if (this.diagnosticsTimer !== null) {
      window.clearTimeout(this.diagnosticsTimer);
      this.diagnosticsTimer = null;
    }

    this.queuedMutationRoots.clear();
    this.requiresFullRefreshFromMutations = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private startNavigationObservation(): void {
    const handleNavigation = (): void => {
      if (this.navigationTimer !== null) {
        window.clearTimeout(this.navigationTimer);
      }

      this.navigationTimer = window.setTimeout(() => {
        this.navigationTimer = null;
        this.refresh();
      }, this.config.spaNavigation.refreshDelayMs);
    };

    this.popStateListener = handleNavigation;
    this.hashChangeListener = handleNavigation;

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);

    if (this.config.spaNavigation.patchHistory) {
      installHistoryPatch();
      this.historyListener = handleNavigation;
      historyListeners.add(handleNavigation);
    }
  }

  private stopNavigationObservation(): void {
    if (this.navigationTimer !== null) {
      window.clearTimeout(this.navigationTimer);
      this.navigationTimer = null;
    }

    if (this.popStateListener) {
      window.removeEventListener('popstate', this.popStateListener);
      this.popStateListener = null;
    }

    if (this.hashChangeListener) {
      window.removeEventListener('hashchange', this.hashChangeListener);
      this.hashChangeListener = null;
    }

    if (this.historyListener) {
      historyListeners.delete(this.historyListener);
      this.historyListener = null;
      uninstallHistoryPatchIfUnused();
    }
  }

  private applyThemeVars(): void {
    const container = this.container ?? document.body;
    if (!container) {
      return;
    }

    const target = (this.config.sitelenPona.applyToRoot ? document.documentElement : container) as HTMLElement;
    Object.entries(this.config.theme.customCssVars ?? {}).forEach(([variable, value]) => {
      target.style.setProperty(variable, value);
    });

    if (this.config.theme.transition) {
      const transition = this.config.theme.transition === 'none' ? '0ms' : 'var(--slp-toggle-motion-duration, 190ms) ease';
      target.style.setProperty('--slp-toggle-transition', transition);
    }
  }

  private static parseTransitionMs(value: string): number {
    const match = value.match(/([0-9]*\.?[0-9]+)\s*ms/);
    if (!match) {
      return 190;
    }

    const parsed = Number.parseFloat(match[1]);
    return Number.isFinite(parsed) ? parsed : 190;
  }

  private applyLayerTransition(): void {
    if (!this.container || this.config.theme.transition === 'none') {
      return;
    }

    if (this.layerTransitionTimer !== null) {
      window.clearTimeout(this.layerTransitionTimer);
    }

    const transitionClass =
      this.config.theme.transition === 'fade-blur' ? 'slp-layer--transition-blur' : 'slp-layer--transition-fade';
    this.container.classList.remove('slp-layer--transition-fade', 'slp-layer--transition-blur');
    this.container.classList.add(transitionClass);

    this.layerTransitionTimer = window.setTimeout(() => {
      if (!this.container) {
        this.layerTransitionTimer = null;
        return;
      }

      this.container.classList.remove('slp-layer--transition-fade', 'slp-layer--transition-blur');
      this.layerTransitionTimer = null;
    }, SitelenLayerPlugin.parseTransitionMs(getComputedStyle(this.container).getPropertyValue('--slp-toggle-motion-duration')) + 80);
  }

  private stopLayerTransition(): void {
    if (this.layerTransitionTimer !== null) {
      window.clearTimeout(this.layerTransitionTimer);
      this.layerTransitionTimer = null;
    }

    if (this.container) {
      this.container.classList.remove('slp-layer--transition-fade', 'slp-layer--transition-blur');
    }
  }

  private pushUnmappedSnapshot(layer: SitelenLayer, topUnmapped: TokenFrequency[]): void {
    const history = this.unmappedHistory[layer] ?? [];
    const timestamp = new Date().toISOString();

    topUnmapped.forEach((entry) => {
      if (entry.count > 0) {
        history.push({ ...entry, layer, timestamp });
      }
    });

    this.unmappedHistory[layer] = history.slice(-200);
  }

  private installTelemetryOnlineObserver(): void {
    if (this.config.telemetry === false || this.telemetryOnlineListener != null) {
      return;
    }

    const handleOnline = (): void => {
      this.scheduleTelemetryFlush();
    };

    this.telemetryOnlineListener = handleOnline;
    window.addEventListener('online', handleOnline);
  }

  private uninstallTelemetryOnlineObserver(): void {
    if (!this.telemetryOnlineListener) {
      return;
    }

    window.removeEventListener('online', this.telemetryOnlineListener);
    this.telemetryOnlineListener = null;
  }

  private recordTelemetryEvent(event: string, payload: Record<string, unknown>): void {
    if (this.config.telemetry === false) {
      return;
    }

    if (Math.random() > (this.config.telemetry.sampleRate ?? DEFAULT_TELEMETRY_SAMPLE_RATE)) {
      return;
    }

    const record = this.createTelemetryEvent(event, payload);
    this.telemetryBuffer.push(record);
    this.telemetryBuffer = this.enforceTelemetryQueueLimit(uniqueTelemetry(this.telemetryBuffer));
    this.scheduleTelemetryFlush();
  }

  private createTelemetryEvent(event: string, payload: Record<string, unknown>): TelemetryRecord {
    const timestamp = new Date().toISOString();
    const fingerprint = this.createTelemetryFingerprint();
    const id = this.createTelemetryId(timestamp);

    return {
      version: 1,
      id,
      fingerprint,
      event,
      timestamp,
      retryCount: 0,
      payload: {
        ...payload,
        ...(this.config.telemetry && this.config.telemetry.includeLayerUsage
          ? { layerUsage: this.getLayerUsageSnapshot() }
          : {})
      }
    };
  }

  private createTelemetryFingerprint(): string {
    const salt = this.config.telemetry && this.config.telemetry.hashSalt ? this.config.telemetry.hashSalt : 'sitelen-layer-plugin';
    const base = `${window.location?.hostname ?? ''}|${document.documentElement?.lang ?? ''}|${salt}`;
    return simpleHash(base);
  }

  private createTelemetryId(timestamp: string): string {
    const salt = this.config.telemetry && this.config.telemetry.hashSalt ? this.config.telemetry.hashSalt : 'sitelen-layer-plugin';
    return `${timestamp}:${++this.lastTelemetryIdSuffix}:${simpleHash(`${salt}|${timestamp}`)}`;
  }

  private scheduleTelemetryFlush(): void {
    if (this.telemetryFlushTimer !== null || this.config.telemetry === false) {
      return;
    }

    const flushInterval = this.config.telemetry.flushIntervalMs ?? DEFAULT_TELEMETRY_FLUSH_MS;
    this.telemetryFlushTimer = window.setTimeout(() => {
      this.telemetryFlushTimer = null;
      void this.flushTelemetryNow();
    }, flushInterval);
  }

  private scheduleTelemetryRetry(): void {
    if (this.telemetryRetryTimer !== null || this.telemetryBuffer.length === 0 || this.config.telemetry === false) {
      return;
    }

    const attempts = this.telemetryBuffer.reduce((max, event) => Math.max(max, event.retryCount), 0);
    const maxRetries = this.config.telemetry.maxRetries ?? DEFAULT_TELEMETRY_MAX_RETRIES;
    if (attempts > maxRetries) {
      return;
    }

    const backoff = this.config.telemetry.retryBackoffMs ?? DEFAULT_TELEMETRY_RETRY_BACKOFF_MS;
    const delay = backoff * Math.pow(2, attempts);
    this.telemetryRetryTimer = window.setTimeout(() => {
      this.telemetryRetryTimer = null;
      void this.flushTelemetryNow();
    }, delay);
  }

  private async flushTelemetryNow(): Promise<void> {
    if (this.config.telemetry === false || this.telemetryFlushInProgress || !window.fetch) {
      return;
    }

    this.telemetryFlushInProgress = true;
    let payload: TelemetryRecord[] = [];

    try {
      this.flushTelemetryQueue();
      if (this.telemetryBuffer.length === 0) {
        return;
      }

      if (!navigator.onLine) {
        const queued = this.enforceTelemetryQueueLimit(
          uniqueTelemetry(this.loadTelemetryQueue().concat(this.telemetryBuffer))
        );
        this.telemetryBuffer = [];
        this.saveTelemetryQueue(queued);
        return;
      }

      const batchSize = this.config.telemetry.batchSize ?? DEFAULT_TELEMETRY_BATCH_SIZE;
      payload = this.telemetryBuffer.splice(0, batchSize);
      if (payload.length === 0) {
        return;
      }

      const response = await fetch(this.config.telemetry.beaconUrl ?? DEFAULT_TELEMETRY_BEACON, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ events: payload })
      });

      if (!response.ok) {
        throw new Error(`telemetry response: ${response.status}`);
      }

      this.lastTelemetryDispatch = Date.now();
      this.telemetryBuffer = this.enforceTelemetryQueueLimit(uniqueTelemetry(this.telemetryBuffer));

      if (this.telemetryBuffer.length > 0) {
        this.scheduleTelemetryFlush();
      }
    } catch {
      const maxRetries = this.config.telemetry.maxRetries ?? DEFAULT_TELEMETRY_MAX_RETRIES;
      const retried = payload.map((event) => ({ ...event, retryCount: event.retryCount + 1 }));
      const queue = this.loadTelemetryQueue().concat(retried);
      this.saveTelemetryQueue(uniqueTelemetry(this.enforceTelemetryQueueLimit(queue)));

      const remainingRetries = retried.filter((event) => event.retryCount <= maxRetries);
      this.telemetryBuffer = this.enforceTelemetryQueueLimit(uniqueTelemetry(this.telemetryBuffer.concat(remainingRetries)));
      this.scheduleTelemetryRetry();
    } finally {
      this.telemetryFlushInProgress = false;
    }
  }

  private flushTelemetryQueue(): void {
    if (this.config.telemetry === false || this.telemetryBuffer.length > 0) {
      return;
    }

    const queued = this.loadTelemetryQueue();
    if (queued.length === 0) {
      return;
    }

    this.telemetryBuffer = this.enforceTelemetryQueueLimit(uniqueTelemetry(queued));
    this.saveTelemetryQueue([]);
  }

  private enforceTelemetryQueueLimit<T extends TelemetryRecord>(records: T[]): T[] {
    const maxSize = this.config.telemetry ? this.config.telemetry.maxQueueSize ?? DEFAULT_TELEMETRY_MAX_QUEUE : DEFAULT_TELEMETRY_MAX_QUEUE;
    return records.slice(-maxSize);
  }

  private loadTelemetryQueue(): TelemetryRecord[] {
    if (!this.config.telemetry) {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(this.offlineQueueStorageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as TelemetryRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveTelemetryQueue(queue: TelemetryRecord[]): void {
    if (!this.config.telemetry) {
      return;
    }

    try {
      window.localStorage.setItem(this.offlineQueueStorageKey, JSON.stringify(queue));
    } catch {
      // keep silently
    }
  }

  private warnDebug(message: string): void {
    if (!this.config.debug) {
      return;
    }

    // eslint-disable-next-line no-console
    console.warn(`[sitelen-layer-plugin] ${message}`);
  }
}

function recordsToFrequency(records: Array<{ token: string; count: number }>): Record<string, number> {
  const result: Record<string, number> = {};

  records.forEach((record) => {
    result[record.token] = (result[record.token] ?? 0) + record.count;
  });

  return result;
}

function uniqueTelemetry(queue: TelemetryRecord[]): TelemetryRecord[] {
  const seen = new Set<string>();

  return queue.filter((event) => {
    const key = event.id || `${event.fingerprint}:${event.event}:${event.timestamp}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return `${hash >>> 0}`;
}
