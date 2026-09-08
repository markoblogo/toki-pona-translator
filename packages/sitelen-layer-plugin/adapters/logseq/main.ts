import { logseq } from '@logseq/libs';
import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';

let pluginInstance: ReturnType<typeof createSitelenLayerPlugin> | null = null;

function mount() {
  pluginInstance?.destroy?.();
  pluginInstance = createSitelenLayerPlugin({
    container: '.markdown-body',
    toggleMode: 'inline',
    showToggle: false,
    defaultLayer: 'latin'
  });
  pluginInstance.init();
}

export const main = async () => {
  await logseq.ready();

  await logseq.App.registerCommandPalette(
    {
      key: 'sitelen-layer-toggle',
      label: 'Sitelen layer: toggle',
      keybinding: { binding: 'ctrl+shift+t' }
    },
    () => {
      const current = pluginInstance?.getState?.().activeLayer;
      if (!pluginInstance) {
        mount();
        return;
      }

      if (current === 'latin') {
        pluginInstance.showLayer('sitelen-emoji');
      } else {
        pluginInstance.showLayer('latin');
      }
    }
  );

  mount();

  logseq.App.onRouteChanged(() => {
    mount();
  });
};
