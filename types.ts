
export type Lang = 'en' | 'pt';

export interface Translations {
  [key: string]: {
    // Header
    title: string;

    // Sidebar
    toolsHeader: string;
    zoom: string;
    filters: string;
    grayscale: string;
    invert: string;
    sepia: string;
    adjustments: string;
    red: string;
    green: string;
    blue: string;

    // Toolbar
    loadImage: string;
    saveImage: string;
    reset: string;

    // Canvas
    canvasPlaceholder: string;
  };
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}
