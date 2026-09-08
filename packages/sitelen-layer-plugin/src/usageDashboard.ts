import type { LayerUsageSnapshot, SitelenLayer } from './types';

export function renderUsageDashboard(
  container: Element | string,
  snapshot: LayerUsageSnapshot
): HTMLDivElement {
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  const root = document.createElement('div');
  const total = Math.max(1, snapshot.totalSwitches);

  const percent = (layer: SitelenLayer): number => Math.round(((snapshot.countsByLayer[layer] ?? 0) / total) * 100);
  const windowLabel = snapshot.windowSeconds ? ` (window ${snapshot.windowSeconds}s)` : '';

  root.className = 'slp-layer-usage-dashboard';
  root.setAttribute('data-sitelen-layer-ui', 'usage-dashboard');
  root.textContent = `Layer usage${windowLabel}\nlatin: ${snapshot.countsByLayer.latin} (${percent('latin')}%)\nsitelen-pona: ${snapshot.countsByLayer['sitelen-pona']} (${percent('sitelen-pona')}%)\nsitelen-emoji: ${snapshot.countsByLayer['sitelen-emoji']} (${percent('sitelen-emoji')}%)`;
  root.style.cssText =
    'position: fixed; right: 16px; top: 16px; z-index: 2147483600; padding: 8px; background: rgba(12,12,12,0.88); color: #f4f6ff; border-radius: 10px; font-size: 11px; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;';

  if (target) {
    target.appendChild(root);
  }

  return root;
}
