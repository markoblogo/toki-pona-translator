const DEFAULT_EXCLUDED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'CODE',
  'PRE',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
  'NOSCRIPT',
  'SVG',
  'CANVAS'
]);

const IGNORE_ATTRIBUTE = 'data-sitelen-layer-ignore';
const SCOPE_ATTRIBUTE = 'data-sitelen-layer-scope';

interface WalkerOptions {
  excludeSelectors: string[];
}

export interface TextNodeCollectionResult {
  textNodes: Text[];
  ignoredCandidates: number;
}

function isHiddenElement(element: Element): boolean {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.hidden || element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  const styles = window.getComputedStyle(element);
  return styles.display === 'none' || styles.visibility === 'hidden';
}

function isExcludedBySelector(node: Node, selectors: string[]): boolean {
  if (selectors.length === 0) {
    return false;
  }

  const parent = node.parentElement;
  if (!parent) {
    return false;
  }

  return selectors.some((selector) => {
    try {
      return Boolean(parent.closest(selector));
    } catch {
      return false;
    }
  });
}

export function isTextNodeAllowed(node: Node, excludeSelectors: string[] = []): boolean {
  const parent = node.parentElement;
  if (!parent) {
    return false;
  }

  if (DEFAULT_EXCLUDED_TAGS.has(parent.tagName)) {
    return false;
  }

  if (parent.closest(`[${IGNORE_ATTRIBUTE}]`)) {
    return false;
  }

  if (isExcludedBySelector(node, excludeSelectors)) {
    return false;
  }

  return !isHiddenElement(parent);
}

function collectTextNodesFromRoot(root: Node, options: WalkerOptions): TextNodeCollectionResult {
  let ignoredCandidates = 0;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node): number {
      if (!(node instanceof Text)) {
        ignoredCandidates += 1;
        return NodeFilter.FILTER_REJECT;
      }

      if (!node.nodeValue || !node.nodeValue.trim()) {
        ignoredCandidates += 1;
        return NodeFilter.FILTER_REJECT;
      }

      if (!isTextNodeAllowed(node, options.excludeSelectors)) {
        ignoredCandidates += 1;
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes: Text[] = [];
  let current: Node | null = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  return {
    textNodes,
    ignoredCandidates
  };
}

export function collectTextNodesInSubtree(root: Node, excludeSelectors: string[] = []): TextNodeCollectionResult {
  return collectTextNodesFromRoot(root, { excludeSelectors });
}

export function collectTextNodes(container: Element, excludeSelectors: string[] = []): TextNodeCollectionResult {
  const scopes = container.querySelectorAll(`[${SCOPE_ATTRIBUTE}]`);

  if (container.hasAttribute(SCOPE_ATTRIBUTE)) {
    return collectTextNodesFromRoot(container, { excludeSelectors });
  }

  if (scopes.length === 0) {
    return collectTextNodesFromRoot(container, { excludeSelectors });
  }

  const results: Text[] = [];
  let ignoredCandidates = 0;
  scopes.forEach((scope) => {
    const scopeResult = collectTextNodesFromRoot(scope, { excludeSelectors });
    results.push(...scopeResult.textNodes);
    ignoredCandidates += scopeResult.ignoredCandidates;
  });

  return {
    textNodes: results,
    ignoredCandidates
  };
}
