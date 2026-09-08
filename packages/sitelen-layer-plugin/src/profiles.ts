import { SitelenLayerPlugin } from './plugin';
import type {
  CreateFromProfilesOptions,
  ProfileResolverOptions,
  ResolvedProfile,
  SitelenLayerPluginConfig,
  SitelenLayerProfile,
  SitelenLayerProfileMatch
} from './types';

function matchesPattern(value: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') {
    return value.toLowerCase() === pattern.toLowerCase();
  }

  return pattern.test(value);
}

function formatPattern(pattern: string | RegExp): string {
  return typeof pattern === 'string' ? pattern : pattern.toString();
}

function matchProfileWithReason(
  match: SitelenLayerProfileMatch | undefined,
  location: Location,
  lang: string
): { ok: boolean; reason: string } {
  if (!match) {
    return { ok: true, reason: 'no match rules (default profile)' };
  }

  const reasons: string[] = [];

  if (match.hostname) {
    if (!matchesPattern(location.hostname, match.hostname)) {
      return { ok: false, reason: `hostname mismatch: ${location.hostname}` };
    }
    reasons.push(`hostname=${formatPattern(match.hostname)}`);
  }

  if (match.pathnamePrefix) {
    if (!location.pathname.startsWith(match.pathnamePrefix)) {
      return { ok: false, reason: `pathnamePrefix mismatch: ${location.pathname}` };
    }
    reasons.push(`pathnamePrefix=${match.pathnamePrefix}`);
  }

  if (match.pathnameRegex) {
    if (!match.pathnameRegex.test(location.pathname)) {
      return { ok: false, reason: `pathnameRegex mismatch: ${location.pathname}` };
    }
    reasons.push(`pathnameRegex=${match.pathnameRegex.toString()}`);
  }

  if (match.lang) {
    if (!lang.toLowerCase().startsWith(match.lang.toLowerCase())) {
      return { ok: false, reason: `lang mismatch: ${lang}` };
    }
    reasons.push(`lang=${match.lang}`);
  }

  return {
    ok: true,
    reason: reasons.length > 0 ? reasons.join(', ') : 'default match'
  };
}

function mergeConfig(
  baseConfig: SitelenLayerPluginConfig,
  profileConfig: Partial<SitelenLayerPluginConfig>
): SitelenLayerPluginConfig {
  return {
    ...baseConfig,
    ...profileConfig,
    sitelenPona: {
      ...(baseConfig.sitelenPona ?? {}),
      ...(profileConfig.sitelenPona ?? {})
    },
    mutationObserver: {
      ...(baseConfig.mutationObserver ?? {}),
      ...(profileConfig.mutationObserver ?? {})
    },
    spaNavigation: {
      ...(baseConfig.spaNavigation ?? {}),
      ...(profileConfig.spaNavigation ?? {})
    }
  };
}

export function resolveProfile(
  profiles: SitelenLayerProfile[],
  options: ProfileResolverOptions = {}
): SitelenLayerProfile | null {
  if (!profiles.length) {
    return null;
  }

  const location = options.location ?? window.location;
  const lang = options.lang ?? document.documentElement.lang ?? '';

  const eligible = profiles
    .filter((profile) => profile.enabled !== false)
    .filter((profile) => matchProfileWithReason(profile.match, location, lang).ok);

  if (!eligible.length) {
    return null;
  }

  return eligible.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0] ?? null;
}

export function resolveProfileConfig(
  profiles: SitelenLayerProfile[],
  options: CreateFromProfilesOptions = {}
): ResolvedProfile | null {
  const baseConfig = options.baseConfig ?? {};
  const location = options.location ?? window.location;
  const lang = options.lang ?? document.documentElement.lang ?? '';
  const matchedProfile = resolveProfile(profiles, options);

  if (!matchedProfile) {
    return null;
  }

  const matchResult = matchProfileWithReason(matchedProfile.match, location, lang);
  const merged = mergeConfig(baseConfig, matchedProfile.config);
  merged.profileId = matchedProfile.id;
  merged.profileMatchReason = matchResult.reason;

  return {
    profile: matchedProfile,
    reason: matchResult.reason,
    config: merged
  };
}

export function createSitelenLayerPluginFromProfiles(
  profiles: SitelenLayerProfile[],
  options: CreateFromProfilesOptions = {}
): SitelenLayerPlugin {
  const baseConfig = options.baseConfig ?? {};
  const location = options.location ?? window.location;
  const lang = options.lang ?? document.documentElement.lang ?? '';
  const resolved = resolveProfileConfig(profiles, options);

  if (resolved) {
    return new SitelenLayerPlugin(resolved.config);
  }

  const fallbackConfig: SitelenLayerPluginConfig = {
    ...baseConfig,
    showToggle: false,
    profileId: null,
    profileMatchReason: `no profile matched for ${location.hostname}${location.pathname} (lang=${lang || 'n/a'})`
  };

  return new SitelenLayerPlugin(fallbackConfig);
}
