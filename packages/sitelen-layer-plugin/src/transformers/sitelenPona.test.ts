import { describe, expect, it } from 'vitest';
import {
  applyContainerLayerClass,
  DEFAULT_SITELEN_PONA_CLASS,
  ensureFontCssLink,
  getSitelenPonaClassName
} from './sitelenPona';

describe('sitelen pona transformer helpers', () => {
  it('applies and removes layer classes correctly', () => {
    const el = document.createElement('div');
    applyContainerLayerClass(el, 'sitelen-pona', DEFAULT_SITELEN_PONA_CLASS);
    expect(el.classList.contains(DEFAULT_SITELEN_PONA_CLASS)).toBe(true);

    applyContainerLayerClass(el, 'latin', DEFAULT_SITELEN_PONA_CLASS);
    expect(el.classList.contains(DEFAULT_SITELEN_PONA_CLASS)).toBe(false);
    expect(el.classList.contains('slp-layer--latin')).toBe(true);
  });

  it('does not duplicate injected font css link', () => {
    const href = 'https://fonts.example.com/nasin.css';
    ensureFontCssLink(href);
    ensureFontCssLink(href);

    const links = document.querySelectorAll(`link[data-sitelen-layer-font-url="${href}"]`);
    expect(links.length).toBe(1);
  });

  it('returns overridden class name when provided', () => {
    expect(getSitelenPonaClassName('custom-layer')).toBe('custom-layer');
    expect(getSitelenPonaClassName()).toBe(DEFAULT_SITELEN_PONA_CLASS);
  });

  it('keeps the standard styling class when a custom class is configured', () => {
    const el = document.createElement('div');
    applyContainerLayerClass(el, 'sitelen-pona', 'custom-layer');

    expect(el.classList.contains(DEFAULT_SITELEN_PONA_CLASS)).toBe(true);
    expect(el.classList.contains('custom-layer')).toBe(true);

    applyContainerLayerClass(el, 'latin', 'custom-layer');
    expect(el.classList.contains(DEFAULT_SITELEN_PONA_CLASS)).toBe(false);
    expect(el.classList.contains('custom-layer')).toBe(false);
    expect(el.classList.contains('slp-layer--latin')).toBe(true);
  });
});
