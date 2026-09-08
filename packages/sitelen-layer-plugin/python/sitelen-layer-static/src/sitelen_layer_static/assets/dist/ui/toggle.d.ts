import type { SitelenLayer, ToggleLabels, ToggleMode, ToggleSize } from '../types';
interface ToggleOptions {
    layers: SitelenLayer[];
    activeLayer: SitelenLayer;
    mount?: Element;
    mode: ToggleMode;
    size: ToggleSize;
    mountedIn?: string;
    labels?: ToggleLabels;
    transition?: 'none' | 'fade' | 'fade-blur';
    disabledLayers?: SitelenLayer[];
    onChange: (layer: SitelenLayer) => void;
}
export declare class LayerToggle {
    private readonly options;
    private root;
    private buttons;
    private preview;
    private mountedMode;
    private readonly handlePointerEnter;
    private readonly handlePointerLeave;
    private readonly handleFocusIn;
    private readonly handleFocusOut;
    private readonly getLayerSymbol;
    constructor(options: ToggleOptions);
    mount(): void;
    getMountedMode(): 'floating' | 'inline';
    setActiveLayer(layer: SitelenLayer): void;
    setDisabledLayers(disabledLayers: SitelenLayer[]): void;
    destroy(): void;
    private setFloatingExpanded;
    private resolveLabel;
}
export {};
