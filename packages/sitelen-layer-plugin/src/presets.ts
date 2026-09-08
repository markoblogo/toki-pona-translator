import type {
  SitelenLayerPluginConfig,
  SitelenLayerProfile,
  SitelenPonaConfig,
  TokiPonaLocalePresetOptions
} from './types';

const DEFAULT_SITELEN_PONA: SitelenPonaConfig = {
  enabled: true,
  fontFamily: "'sitelen seli kiwen asuki', 'nasin nanpa', sans-serif",
  renderStrategy: 'ligature-font'
};

export function createTokiPonaLocaleProfiles(options: TokiPonaLocalePresetOptions): SitelenLayerProfile[] {
  const tpPathPrefix = options.tpPathPrefix ?? '/tp';
  const nonTpPathPrefix = options.nonTpPathPrefix ?? '/en';

  return [
    {
      id: 'tp-locale',
      priority: 20,
      match: { pathnamePrefix: tpPathPrefix },
      config: {
        container: options.container,
        toggleMount: options.toggleMount,
        toggleMode: options.toggleMode,
        toggleSize: options.toggleSize,
        toggleLabels: options.toggleLabels,
        emojiExcludeSelectors: options.emojiExcludeSelectors,
        storageKey: options.storageKey,
        layers: ['latin', 'sitelen-pona', 'sitelen-emoji'],
        defaultLayer: 'latin',
        requireDominantTokiPona: true,
        threshold: options.threshold ?? 0.7,
        showToggle: true,
        debug: options.debug ?? false,
        debugOverlay: options.debugOverlay ?? false,
        mutationObserver: options.mutationObserver,
        sitelenPona: {
          ...DEFAULT_SITELEN_PONA,
          ...(options.sitelenPona ?? {})
        }
      }
    },
    {
      id: 'non-tp-locale',
      priority: 10,
      match: { pathnamePrefix: nonTpPathPrefix },
      config: {
        container: options.container,
        toggleMount: options.toggleMount,
        toggleMode: options.toggleMode,
        toggleSize: options.toggleSize,
        toggleLabels: options.toggleLabels,
        emojiExcludeSelectors: options.emojiExcludeSelectors,
        storageKey: options.storageKey,
        layers: ['latin'],
        defaultLayer: 'latin',
        showToggle: options.nonTpShowToggle ?? false,
        requireDominantTokiPona: true,
        debug: false,
        debugOverlay: false
      }
    }
  ];
}
