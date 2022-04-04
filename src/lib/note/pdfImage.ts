import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { v4 as getUid } from "uuid";
import { createVirtualCanvas, releaseCanvas } from "../draw/drawer";
import { createEmptyNote, Note, NotePage } from "./note";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function getCanvasBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((res: BlobCallback) => {
    canvas.toBlob(res);
  });
}

async function getPageImage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  scale: number
): Promise<[Blob, number]> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  console.log({viewport});

  const { height, width } = viewport;
  const ratio = height / width;
  const { canvas, context } = createVirtualCanvas(
    Math.floor(width * scale),
    Math.floor(height * scale)
  );

  await page.render({
    canvasContext: context,
    viewport: viewport,
    transform: [scale, 0, 0, scale, 0, 0],
  }).promise;

  const blob = await getCanvasBlob(canvas);
  if (!blob) throw new Error("can't get canvas image blob");

  releaseCanvas(canvas);
  
  return [blob, ratio];
}

export async function getImages(
  url: string,
  scale = 2,
  progressCb?: (percent: number) => void
) {
  const pdf = await pdfjs.getDocument(url).promise;
  const { numPages } = pdf;
  const blobs: Blob[] = [];
  const ratios: number[] = [];

  for (let i = 1; i <= numPages; i += 1) {
    const [blob, ratio] = await getPageImage(pdf, i, scale);
    blobs.push(blob);
    ratios.push(ratio);
    if (progressCb) progressCb(Math.floor((i / numPages) * 100));
  }

  return {
    images: blobs,
    ratios,
  };
}

export async function getOneImage(
  url: string,
  index: number,
  scale = 2,
) {
  const pdf = await pdfjs.getDocument(url).promise;
  const { numPages } = pdf;
  if (index > numPages) {
    throw new Error('index out of range');
  }
  const [blob] = await getPageImage(pdf, index, scale);
  return blob;
}

export async function getOneImageFromFile(
  file: File,
  index: number,
  scale = 2,
) {
  const url = URL.createObjectURL(file);
  const blob = await getOneImage(url, index, scale);
  URL.revokeObjectURL(url);
  return blob;
}

export async function LoadPDF(
  file: File,
  progressCb?: (percent: number) => void
): Promise<Note> {
  const url = URL.createObjectURL(file);
  const { images, ratios } = await getImages(url, 0.5, progressCb);
  URL.revokeObjectURL(url);
  const pageRec: Record<string, NotePage> = {};
  const pageOrder: string[] = [];
  images.forEach((image, idx) => {
    const pageId = getUid();
    pageRec[pageId] = {
      image,
      ratio: ratios[idx],
      state: {
        strokes: [],
      },
      pdfIndex: idx + 1,
    };
    pageOrder.push(pageId);
  });
  const name = file.name.replace(".pdf", "");
  return {
    ...createEmptyNote(),
    name,
    withImg: true,
    pdf: file,
    thumbnail: images[0],
    pageRec,
    pageOrder,
  };
}

export async function loadPDFImages(file: File) {
  const url = URL.createObjectURL(file);
  const { images } = await getImages(url, 0.5);
  URL.revokeObjectURL(url);
  return images;
}
