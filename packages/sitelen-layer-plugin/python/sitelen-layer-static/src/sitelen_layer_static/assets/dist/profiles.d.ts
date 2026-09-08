import { SitelenLayerPlugin } from './plugin';
import type { CreateFromProfilesOptions, ProfileResolverOptions, ResolvedProfile, SitelenLayerProfile } from './types';
export declare function resolveProfile(profiles: SitelenLayerProfile[], options?: ProfileResolverOptions): SitelenLayerProfile | null;
export declare function resolveProfileConfig(profiles: SitelenLayerProfile[], options?: CreateFromProfilesOptions): ResolvedProfile | null;
export declare function createSitelenLayerPluginFromProfiles(profiles: SitelenLayerProfile[], options?: CreateFromProfilesOptions): SitelenLayerPlugin;
