import {
  getGloballyLoadedEsmPackage,
  globallyLoadEsmPackage,
} from '#src/common/utils/load-esm-package';

type PDFJS = typeof import('pdfjs-dist');

export const globallyLoadPDFJS = (): Promise<PDFJS> =>
  globallyLoadEsmPackage('pdfjs-dist/legacy/build/pdf.mjs');
export const getPDFJS = (): PDFJS =>
  getGloballyLoadedEsmPackage('pdfjs-dist/legacy/build/pdf.mjs');
