type ToPngFn = (node: HTMLElement, options?: Record<string, unknown>) => Promise<string>;

type JsPdfInstance = {
  internal: {
    pageSize: {
      getWidth: () => number;
      getHeight: () => number;
    };
  };
  addImage: (...args: unknown[]) => void;
  save: (fileName: string) => void;
};

export type JsPdfConstructor = new (orientation: string, unit: string, format: string) => JsPdfInstance;

export type PptxGenInstance = {
  layout: {
    width: number;
    height: number;
  };
  addSlide: () => {
    addImage: (options: { data: string; x: number; y: number; w: number; h: number }) => void;
  };
  writeFile: (fileName: string) => Promise<void>;
};

export type PptxGenConstructor = new () => PptxGenInstance;

export type ExportDependencyError = Error & { library?: string };

const CDNS = {
  htmlToImage: 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/+esm',
  jsPdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm',
  pptxGen: 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm',
} as const;

const cache: {
  toPng?: Promise<ToPngFn>;
  jsPdf?: Promise<JsPdfConstructor>;
  pptxGen?: Promise<PptxGenConstructor>;
} = {};

const buildDependencyError = (library: string, error: unknown): ExportDependencyError => {
    console.error(`Failed to load ${library} library`, error);
    const dependencyError = new Error('EXPORT_DEPENDENCY_UNAVAILABLE') as ExportDependencyError;
    dependencyError.library = library;
    if (error instanceof Error && 'cause' in Error.prototype) {
      (dependencyError as Error & { cause?: Error }).cause = error;
    }
    return dependencyError;
};

const importFromCdn = async <T>(library: keyof typeof CDNS, pick: (mod: any) => T | undefined) => {
  try {
    const module = await import(/* @vite-ignore */ CDNS[library]);
    const selected = pick(module);
    if (!selected) {
      throw new Error('Missing expected export.');
    }
    return selected;
  } catch (error) {
    throw buildDependencyError(library, error);
  }
};

export const loadToPng = async (): Promise<ToPngFn> => {
  cache.toPng ||= importFromCdn('htmlToImage', (mod) => mod?.toPng as ToPngFn | undefined);
  return cache.toPng;
};

export const loadJsPdf = async (): Promise<JsPdfConstructor> => {
  cache.jsPdf ||= importFromCdn('jsPdf', (mod) => mod?.default as JsPdfConstructor | undefined);
  return cache.jsPdf;
};

export const loadPptxGen = async (): Promise<PptxGenConstructor> => {
  cache.pptxGen ||= importFromCdn('pptxGen', (mod) => mod?.default as PptxGenConstructor | undefined);
  return cache.pptxGen;
};
