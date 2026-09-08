import type { SitelenLayer, ToggleLabelSpec, ToggleLabels, ToggleMode, ToggleSize } from '../types';

interface ToggleOptions {
  layers: SitelenLayer[];
  activeLayer: SitelenLayer;
  mount?: Element;
  mode: ToggleMode;
  size: ToggleSize;
  mountedIn?: string;
  labels?: ToggleLabels;
  transition?: 'none' | 'fade' | 'fade-blur';
  disabledLayers?: SitelenLayer[];
  onChange: (layer: SitelenLayer) => void;
}

const SYMBOLS: Record<SitelenLayer, string> = {
  latin: 'TP',
  'sitelen-pona': 'SP',
  'sitelen-emoji': '🙂'
};

const LABELS: Record<SitelenLayer, string> = {
  latin: 'Latin layer',
  'sitelen-pona': 'Sitelen pona layer',
  'sitelen-emoji': 'Sitelen emoji layer'
};

export class LayerToggle {
  private root: HTMLDivElement;
  private buttons = new Map<SitelenLayer, HTMLButtonElement>();
  private preview: HTMLSpanElement;
  private mountedMode: 'floating' | 'inline' = 'floating';

  private readonly handlePointerEnter = (): void => {
    this.setFloatingExpanded(true);
  };

  private readonly handlePointerLeave = (): void => {
    this.setFloatingExpanded(false);
  };

  private readonly handleFocusIn = (): void => {
    this.setFloatingExpanded(true);
  };

  private readonly handleFocusOut = (event: FocusEvent): void => {
    const relatedTarget = event.relatedTarget as Node | null;
    if (!this.root.contains(relatedTarget)) {
      this.setFloatingExpanded(false);
    }
  };

  private readonly getLayerSymbol = (layer: SitelenLayer): string => SYMBOLS[layer];

  constructor(private readonly options: ToggleOptions) {
    this.root = document.createElement('div');
    this.preview = document.createElement('span');
    this.root.className = 'slp-toggle';
    this.root.classList.add(`slp-toggle--size-${this.options.size}`);
    if (this.options.transition && this.options.transition !== 'none') {
      this.root.classList.add(`slp-toggle--${this.options.transition}`);
    }
    this.root.setAttribute('data-sitelen-layer-ui', 'toggle');
    this.root.setAttribute('role', 'group');
    this.root.setAttribute('aria-label', 'Sitelen layer switcher');

    this.preview.className = 'slp-toggle__preview';
    this.root.appendChild(this.preview);

    this.options.layers.forEach((layer) => {
      const button = document.createElement('button');
      const label = this.resolveLabel(layer);
      button.type = 'button';
      button.className = 'slp-toggle__btn';
      button.textContent = label.text ?? SYMBOLS[layer];
      button.setAttribute('aria-label', label.ariaLabel ?? LABELS[layer]);
      if (label.title) {
        button.title = label.title;
      }
      if (label.className) {
        button.classList.add(label.className);
      }
      button.dataset.layer = layer;
      button.addEventListener('click', () => {
        if (button.disabled) {
          return;
        }

        this.options.onChange(layer);
      });
      this.buttons.set(layer, button);
      this.root.appendChild(button);
    });

    this.setDisabledLayers(this.options.disabledLayers ?? []);
    this.setActiveLayer(this.options.activeLayer);
  }

  mount(): void {
    const shouldInline =
      this.options.mode === 'inline' || (this.options.mode === 'auto' && Boolean(this.options.mount));
    const mountPoint = shouldInline ? this.options.mount : undefined;

    if (mountPoint) {
      mountPoint.appendChild(this.root);
      this.root.classList.add('slp-toggle--mounted');
      this.root.classList.remove('slp-toggle--floating', 'slp-toggle--collapsed');
      this.root.removeEventListener('pointerenter', this.handlePointerEnter);
      this.root.removeEventListener('pointerleave', this.handlePointerLeave);
      this.root.removeEventListener('focusin', this.handleFocusIn);
      this.root.removeEventListener('focusout', this.handleFocusOut);
      this.root.removeAttribute('data-slp-toggle-expanded');
      this.root.removeAttribute('data-slp-toggle-collapsed');

      this.root.setAttribute('data-slp-toggle-mode', 'inline');
      if (this.options.mountedIn) {
        this.root.setAttribute('data-slp-toggle-mounted-in', this.options.mountedIn);
      }

      this.mountedMode = 'inline';
      return;
    }

    document.body.appendChild(this.root);
    this.root.classList.add('slp-toggle--floating', 'slp-toggle--collapsed');
    this.root.classList.remove('slp-toggle--mounted');
    this.root.setAttribute('data-slp-toggle-mode', 'floating');
    this.root.removeAttribute('data-slp-toggle-mounted-in');
    this.root.addEventListener('pointerenter', this.handlePointerEnter);
    this.root.addEventListener('pointerleave', this.handlePointerLeave);
    this.root.addEventListener('focusin', this.handleFocusIn);
    this.root.addEventListener('focusout', this.handleFocusOut);
    this.setFloatingExpanded(false);

    this.mountedMode = 'floating';
  }

  getMountedMode(): 'floating' | 'inline' {
    return this.mountedMode;
  }

  setActiveLayer(layer: SitelenLayer): void {
    this.preview.textContent = this.getLayerSymbol(layer);
    this.buttons.forEach((button, key) => {
      const active = key === layer;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  setDisabledLayers(disabledLayers: SitelenLayer[]): void {
    const disabled = new Set(disabledLayers);
    this.buttons.forEach((button, layer) => {
      const isDisabled = disabled.has(layer);
      button.disabled = isDisabled;
      button.classList.toggle('is-disabled', isDisabled);
      button.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    });
  }

  destroy(): void {
    this.root.removeEventListener('pointerenter', this.handlePointerEnter);
    this.root.removeEventListener('pointerleave', this.handlePointerLeave);
    this.root.removeEventListener('focusin', this.handleFocusIn);
    this.root.removeEventListener('focusout', this.handleFocusOut);
    this.root.remove();
    this.buttons.clear();
  }

  private setFloatingExpanded(isExpanded: boolean): void {
    if (this.options.mode === 'inline') {
      return;
    }

    if (!this.root.classList.contains('slp-toggle--floating')) {
      return;
    }

    if (isExpanded) {
      this.root.classList.add('slp-toggle--expanded');
      this.root.classList.remove('slp-toggle--collapsed');
      this.root.setAttribute('data-slp-toggle-expanded', 'true');
      this.root.removeAttribute('data-slp-toggle-collapsed');
      return;
    }

    this.root.classList.add('slp-toggle--collapsed');
    this.root.classList.remove('slp-toggle--expanded');
    this.root.setAttribute('data-slp-toggle-collapsed', 'true');
    this.root.removeAttribute('data-slp-toggle-expanded');
  }

  private resolveLabel(layer: SitelenLayer): ToggleLabelSpec {
    const configured = this.options.labels?.[layer];
    if (!configured) {
      return {};
    }

    if (typeof configured === 'string') {
      return { text: configured };
    }

    return configured;
  }
}
