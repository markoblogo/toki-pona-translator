import type { SitelenLayer } from './types';

export function readStoredLayer(storageKey: string): SitelenLayer | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (value === 'latin' || value === 'sitelen-pona' || value === 'sitelen-emoji') {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeStoredLayer(storageKey: string, layer: SitelenLayer): void {
  try {
    window.localStorage.setItem(storageKey, layer);
  } catch {
    // Ignore storage errors (private mode, blocked storage, etc.)
  }
}
