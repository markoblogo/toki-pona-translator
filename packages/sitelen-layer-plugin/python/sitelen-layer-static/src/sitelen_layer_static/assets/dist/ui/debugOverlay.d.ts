import type { PluginDiagnostics } from '../types';
export declare class DebugOverlay {
    private root;
    private content;
    private collapsed;
    constructor();
    mount(): void;
    update(diagnostics: PluginDiagnostics): void;
    destroy(): void;
}
