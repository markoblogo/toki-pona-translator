import { describe, expect, it } from 'vitest';
import { resolveProfile, resolveProfileConfig } from './profiles';
import type { SitelenLayerProfile } from './types';

describe('profiles', () => {
  const profiles: SitelenLayerProfile[] = [
    {
      id: 'tok-locale',
      priority: 20,
      match: { pathnamePrefix: '/tok/' },
      config: { container: '#tok-content' }
    },
    {
      id: 'landing',
      priority: 10,
      match: { pathnameRegex: /^\/landing/ },
      config: { container: '#landing' }
    }
  ];

  it('resolves matching profile by path and priority', () => {
    const fakeLocation = {
      hostname: 'example.com',
      pathname: '/tok/home'
    } as Location;

    const profile = resolveProfile(profiles, { location: fakeLocation, lang: 'tok' });
    expect(profile?.id).toBe('tok-locale');
  });

  it('returns null when no profile matches', () => {
    const fakeLocation = {
      hostname: 'example.com',
      pathname: '/en/home'
    } as Location;

    const profile = resolveProfile(profiles, { location: fakeLocation, lang: 'en' });
    expect(profile).toBeNull();
  });

  it('merges base config with matched profile config', () => {
    const fakeLocation = {
      hostname: 'example.com',
      pathname: '/tok/home'
    } as Location;

    const resolved = resolveProfileConfig(profiles, {
      location: fakeLocation,
      baseConfig: {
        threshold: 0.8,
        sitelenPona: { enabled: true, applyToRoot: false }
      }
    });

    expect(resolved?.config.container).toBe('#tok-content');
    expect(resolved?.config.threshold).toBe(0.8);
    expect(resolved?.config.profileId).toBe('tok-locale');
    expect(resolved?.reason).toContain('pathnamePrefix=/tok/');
  });
});
