import '../sitelen-pona-font.css';
import { createSitelenLayerPlugin, getEmojiMapping } from '../src';

const selector = document.querySelector('#selector') as HTMLInputElement;
const threshold = document.querySelector('#threshold') as HTMLInputElement;
const detectionStrategy = document.querySelector('#detection-strategy') as HTMLSelectElement;
const transformStrategy = document.querySelector('#transform-strategy') as HTMLSelectElement;
const renderStrategy = document.querySelector('#render-strategy') as HTMLSelectElement;
const toggleMode = document.querySelector('#toggle-mode') as HTMLSelectElement;
const showToggle = document.querySelector('#show-toggle') as HTMLInputElement;
const useCustomTheme = document.querySelector('#use-custom-theme') as HTMLInputElement;
const recreateButton = document.querySelector('#recreate-btn') as HTMLButtonElement;
const refreshButton = document.querySelector('#refresh-btn') as HTMLButtonElement;
const editor = document.querySelector('#source-editor') as HTMLTextAreaElement;
const preview = document.querySelector('#playground-preview') as HTMLDivElement;
const diagnosticsLog = document.querySelector('#diagnostics-log') as HTMLDivElement;

function buildConfig() {
  const containerSelector = selector.value.trim() || '#playground-preview';
  return {
    container: containerSelector,
    toggleMount: '#playground-toggle-slot',
    threshold: Number(threshold.value) || 0.7,
    detection: {
      strategy: detectionStrategy.value as 'weighted' | 'simple',
      minTokens: 4
    },
    showToggle: showToggle.checked,
    toggleMode: toggleMode.value as 'floating' | 'inline' | 'auto',
    sitelenPona: {
      enabled: true,
      renderStrategy: renderStrategy.value as 'ligature-font' | 'font-only' | 'transform',
      transformStrategy: transformStrategy.value as 'mvp' | 'rules' | 'api'
    },
    theme: useCustomTheme.checked
      ? {
          customCssVars: {
            '--slp-toggle-bg': 'rgba(20, 28, 57, 0.94)',
            '--slp-toggle-border': 'rgba(173, 197, 255, 0.36)',
            '--slp-toggle-fg': '#f1f5ff',
            '--slp-toggle-active-bg': '#f1f5ff',
            '--slp-toggle-active-fg': '#121826',
            '--slp-toggle-radius': '12px'
          }
        }
      : undefined,
    onDiagnostics: (diagnostics) => {
      diagnosticsLog.textContent = JSON.stringify(
        {
          type: 'diagnostics',
          version: getEmojiMapping().metadata.version,
          diagnostics
        },
        null,
        2
      );
    }
  };
}

function hydratePreview() {
  preview.innerHTML = '';
  const p = document.createElement('div');
  p.style.cssText = 'padding: 8px 2px;';
  const text = document.createElement('p');
  text.textContent = editor.value;
  p.appendChild(text);
  preview.appendChild(p);
}

function createPluginFromUi() {
  if (plugin) {
    plugin.destroy();
  }

  hydratePreview();
  const config = buildConfig();

  const nextPlugin = createSitelenLayerPlugin({
    ...config
  });
  nextPlugin.init();
  return nextPlugin;
}

let plugin: ReturnType<typeof createSitelenLayerPlugin> | null = null;

function recreatePlugin() {
  if (plugin) {
    plugin.destroy();
  }
  plugin = createPluginFromUi();
}

recreateButton.addEventListener('click', recreatePlugin);
refreshButton.addEventListener('click', () => {
  plugin?.refresh();
});

editor.addEventListener('input', () => {
  hydratePreview();
  plugin?.refresh();
});

[selector, threshold, detectionStrategy, transformStrategy, renderStrategy, toggleMode, showToggle, useCustomTheme].forEach(
  (element) => {
    element.addEventListener('change', recreatePlugin);
  }
);

recreatePlugin();
plugin?.showDiagnosticsOverlay();
