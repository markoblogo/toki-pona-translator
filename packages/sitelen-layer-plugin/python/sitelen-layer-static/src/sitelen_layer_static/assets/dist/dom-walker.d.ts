export interface TextNodeCollectionResult {
    textNodes: Text[];
    ignoredCandidates: number;
}
export declare function isTextNodeAllowed(node: Node, excludeSelectors?: string[]): boolean;
export declare function collectTextNodesInSubtree(root: Node, excludeSelectors?: string[]): TextNodeCollectionResult;
export declare function collectTextNodes(container: Element, excludeSelectors?: string[]): TextNodeCollectionResult;
