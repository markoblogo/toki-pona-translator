import { describe, expect, it } from 'vitest';
import { createTokiPonaLocaleProfiles } from './presets';

describe('presets', () => {
  it('creates tp/non-tp profiles with expected defaults', () => {
    const profiles = createTokiPonaLocaleProfiles({ container: '#tp-content' });

    expect(profiles).toHaveLength(2);
    expect(profiles[0].id).toBe('tp-locale');
    expect(profiles[0].config.layers).toEqual(['latin', 'sitelen-pona', 'sitelen-emoji']);
    expect(profiles[0].config.threshold).toBe(0.7);

    expect(profiles[1].id).toBe('non-tp-locale');
    expect(profiles[1].config.showToggle).toBe(false);
    expect(profiles[1].config.layers).toEqual(['latin']);
  });

  it('respects custom route prefixes', () => {
    const profiles = createTokiPonaLocaleProfiles({
      container: '#tp-content',
      tpPathPrefix: '/tok',
      nonTpPathPrefix: '/eng'
    });

    expect(profiles[0].match?.pathnamePrefix).toBe('/tok');
    expect(profiles[1].match?.pathnamePrefix).toBe('/eng');
  });

  it('passes toggle mount and storage key through both profiles', () => {
    const profiles = createTokiPonaLocaleProfiles({
      container: '#tp-content',
      toggleMount: '#header-toggle',
      storageKey: 'toki-free-layer',
      nonTpShowToggle: true
    });

    expect(profiles[0].config.toggleMount).toBe('#header-toggle');
    expect(profiles[1].config.toggleMount).toBe('#header-toggle');
    expect(profiles[0].config.storageKey).toBe('toki-free-layer');
    expect(profiles[1].config.storageKey).toBe('toki-free-layer');
    expect(profiles[1].config.showToggle).toBe(true);
  });

  it('passes toggle mode, labels and emoji excludes through both profiles', () => {
    const profiles = createTokiPonaLocaleProfiles({
      container: '#tp-content',
      toggleMode: 'auto',
      toggleSize: 'lg',
      toggleLabels: {
        latin: 'TP',
        'sitelen-emoji': { text: '🙂', ariaLabel: 'Sitelen emoji' }
      },
      emojiExcludeSelectors: ['header', '.logo']
    });

    expect(profiles[0].config.toggleMode).toBe('auto');
    expect(profiles[1].config.toggleMode).toBe('auto');
    expect(profiles[0].config.toggleSize).toBe('lg');
    expect(profiles[1].config.toggleSize).toBe('lg');
    expect(profiles[0].config.toggleLabels).toEqual({
      latin: 'TP',
      'sitelen-emoji': { text: '🙂', ariaLabel: 'Sitelen emoji' }
    });
    expect(profiles[1].config.emojiExcludeSelectors).toEqual(['header', '.logo']);
  });
});
