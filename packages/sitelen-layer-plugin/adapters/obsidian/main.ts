import { App, Plugin } from 'obsidian';
import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';

export default class SitelenLayerObsidianPlugin extends Plugin {
  private layer: ReturnType<typeof createSitelenLayerPlugin> | null = null;

  override async onload(): Promise<void> {
    this.layer = createSitelenLayerPlugin({
      container: '.markdown-preview-view',
      defaultLayer: 'latin',
      toggleMode: 'inline',
      showToggle: true
    });

    this.layer.init();

    this.addRibbonIcon('paintbrush', 'Toggle sitelen layer', () => {
      const current = this.layer?.getState?.().toggleState?.isOn;
      if (!this.layer) {
        return;
      }

      if (current) {
        this.layer.showLayer('latin');
      } else {
        this.layer.showLayer('sitelen-emoji');
      }
    });
  }

  override onunload(): void {
    this.layer?.destroy();
    this.layer = null;
  }
}
