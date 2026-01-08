declare module 'pptxgenjs' {
  export type Layout = 'LAYOUT_4x3' | 'LAYOUT_16x9' | 'LAYOUT_WIDE' | string;

  export interface SlideImageOptions {
    data: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }

  export interface Slide {
    addImage(options: SlideImageOptions): void;
  }

  export default class PptxGenJS {
    layout: { width: number; height: number };
    constructor();
    addSlide(): Slide;
    writeFile(fileName: string): Promise<void>;
  }
}
