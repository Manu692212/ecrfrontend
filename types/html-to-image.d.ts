declare module 'html-to-image' {
  type Filter = (node: HTMLElement) => boolean;

  export interface Options {
    filter?: Filter;
    backgroundColor?: string;
    cacheBust?: boolean;
    imagePlaceholder?: string;
    pixelRatio?: number;
    style?: Partial<CSSStyleDeclaration>;
  }

  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
}
