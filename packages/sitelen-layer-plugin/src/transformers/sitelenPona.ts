import type { SitelenLayer, SitelenPonaConfig } from '../types';

export const DEFAULT_SITELEN_PONA_FONT = "'sitelen seli kiwen asuki', 'nasin nanpa', sans-serif";
export const DEFAULT_SITELEN_PONA_CLASS = 'slp-layer--sitelen-pona';
export const LATIN_CLASS = 'slp-layer--latin';
export const EMOJI_CLASS = 'slp-layer--sitelen-emoji';
const FONT_LINK_ATTR = 'data-sitelen-layer-font-url';

function firstFontFamily(fontFamily: string): string {
  const first = fontFamily.split(',')[0] ?? '';
  return first.trim().replace(/^['"]|['"]$/g, '');
}

export function ensureFontCssLink(fontCssUrl?: string): void {
  if (!fontCssUrl) {
    return;
  }

  const existing = document.querySelector(`link[${FONT_LINK_ATTR}="${fontCssUrl}"]`);
  if (existing) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontCssUrl;
  link.setAttribute(FONT_LINK_ATTR, fontCssUrl);
  document.head.appendChild(link);
}

export function applySitelenPonaVariables(
  container: Element,
  sitelenPonaConfig: Required<SitelenPonaConfig>
): void {
  const target = sitelenPonaConfig.applyToRoot ? document.documentElement : container;
  target.classList.add('slp-sitelen-pona-enabled');

  if (target instanceof HTMLElement) {
    target.style.setProperty('--slp-font-sitelen-pona', sitelenPonaConfig.fontFamily);
  }
}

export function clearSitelenPonaVariables(container: Element, applyToRoot: boolean): void {
  const target = applyToRoot ? document.documentElement : container;
  target.classList.remove('slp-sitelen-pona-enabled');

  if (target instanceof HTMLElement) {
    target.style.removeProperty('--slp-font-sitelen-pona');
  }
}

export function isSitelenPonaFontReady(fontFamily: string): boolean {
  const family = firstFontFamily(fontFamily);
  if (!family || !('fonts' in document) || !document.fonts) {
    return false;
  }

  try {
    return document.fonts.check(`16px "${family}"`) || document.fonts.check(`16px ${family}`);
  } catch {
    return false;
  }
}

export function getSitelenPonaClassName(configClassName?: string): string {
  return configClassName?.trim() || DEFAULT_SITELEN_PONA_CLASS;
}

export function applyContainerLayerClass(container: Element, layer: SitelenLayer, sitelenPonaClassName: string): void {
  container.classList.remove(LATIN_CLASS, EMOJI_CLASS, DEFAULT_SITELEN_PONA_CLASS, sitelenPonaClassName);

  if (layer === 'latin') {
    container.classList.add(LATIN_CLASS);
    return;
  }

  if (layer === 'sitelen-emoji') {
    container.classList.add(EMOJI_CLASS);
    return;
  }

  if (layer === 'sitelen-pona') {
    container.classList.add(DEFAULT_SITELEN_PONA_CLASS);
    if (sitelenPonaClassName !== DEFAULT_SITELEN_PONA_CLASS) {
      container.classList.add(sitelenPonaClassName);
    }
  }
}
