import '../sitelen-pona-font.css';
import { createSitelenLayerPlugin, getEmojiMapping } from '../src';

const debugLog = document.querySelector('#debug-log') as HTMLDivElement;
const refreshButton = document.querySelector('#refresh-btn') as HTMLButtonElement;
const overlayButton = document.querySelector('#overlay-btn') as HTMLButtonElement;

let overlayVisible = true;

const plugin = createSitelenLayerPlugin({
  container: '#eligible-container',
  toggleMount: '#toggle-slot',
  debug: true,
  debugOverlay: true,
  requireDominantTokiPona: true,
  threshold: 0.7,
  observeMutations: true,
  sitelenPona: {
    enabled: true,
    fontFamily: "'sitelen seli kiwen asuki', 'nasin nanpa', sans-serif",
    renderStrategy: 'ligature-font'
  },
  onEligibilityChange: (eligible, diagnostics) => {
    debugLog.textContent = JSON.stringify(
      {
        type: 'eligibility-change',
        eligible,
        diagnostics,
        emojiMappingVersion: getEmojiMapping().metadata.version
      },
      null,
      2
    );
  },
  onDiagnostics: (diagnostics) => {
    debugLog.textContent = JSON.stringify(
      {
        type: 'diagnostics',
        diagnostics,
        emojiMappingVersion: getEmojiMapping().metadata.version
      },
      null,
      2
    );
  }
});

plugin.init();

const mixedPlugin = createSitelenLayerPlugin({
  container: '#mixed-container',
  debug: true,
  debugOverlay: false,
  showToggle: true,
  storageKey: 'sitelen-layer-plugin:mixed-demo',
  requireDominantTokiPona: true
});

mixedPlugin.init();

refreshButton.addEventListener('click', () => {
  plugin.refresh();
  mixedPlugin.refresh();
});

overlayButton.addEventListener('click', () => {
  overlayVisible = !overlayVisible;
  if (overlayVisible) {
    plugin.showDiagnosticsOverlay();
    return;
  }

  plugin.hideDiagnosticsOverlay();
});

(window as any).sitelenLayerDemo = { plugin, mixedPlugin };
