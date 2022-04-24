import localforage from "localforage";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { v4 as getUid } from "uuid";
import { createVirtualCanvas, releaseCanvas } from "../draw/drawer";
import { createEmptyNote, Note, NotePage } from "./note";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function getPDFDocument(file: Blob) {
  const data = new Uint8Array(await file.arrayBuffer());
  return pdfjs.getDocument(data).promise;
}

async function getPageImage(
  doc: PDFDocumentProxy,
  pageNum: number,
  scale: number
): Promise<[string, number]> {
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  console.log({ viewport });

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

  const data = canvas.toDataURL();

  releaseCanvas(canvas);

  return [data, ratio];
}

export async function getPDFImages(
  file: Blob,
  scale = 2,
  progressCb?: (percent: number) => void
) {
  const doc = await getPDFDocument(file);
  const { numPages } = doc;
  const images: string[] = [];
  const ratios: number[] = [];

  for (let i = 1; i <= numPages; i += 1) {
    const [data, ratio] = await getPageImage(doc, i, scale);
    images.push(data);
    ratios.push(ratio);
    if (progressCb) progressCb(Math.floor((i / numPages) * 100));
  }

  return { images, ratios };
}

export async function getOneImage(file: Blob, index: number, scale = 2) {
  const doc = await getPDFDocument(file);
  const { numPages } = doc;
  if (index > numPages) {
    throw new Error("index out of range");
  }
  const [data] = await getPageImage(doc, index, scale);
  return data;
}

const IMAGE_CACHE_NUMBER = 10;
async function getImageCache(noteID: string, index: number) {
  let cacheList = ((await localforage.getItem("IMAGE_CACHE")) ||
    []) as string[];
  const key = `IMAGE_${noteID}_${index}`;
  if (!cacheList.includes(key)) return;
  cacheList = [key, ...cacheList.filter((id) => id !== key)];
  await localforage.setItem("IMAGE_CACHE", cacheList);
  return (await localforage.getItem(key)) as string;
}

async function setImageCache(noteID: string, index: number, data: string) {
  let cacheList = ((await localforage.getItem("IMAGE_CACHE")) ||
    []) as string[];
  const key = `IMAGE_${noteID}_${index}`;
  cacheList = [key, ...cacheList.filter((id) => id !== key)];
  if (cacheList.length > IMAGE_CACHE_NUMBER) {
    const deleteList = cacheList.slice(IMAGE_CACHE_NUMBER);
    cacheList = cacheList.slice(0, IMAGE_CACHE_NUMBER);
    for (let id of deleteList) {
      await localforage.removeItem(id);
    }
  }
  await localforage.setItem("IMAGE_CACHE", cacheList);
  await localforage.setItem(key, data);
}

export async function getOnePageImage(noteID: string, index: number) {
  const cached = await getImageCache(noteID, index);
  if (cached) return cached;
  const file = (await localforage.getItem(`PDF_${noteID}`)) as Blob | undefined;
  const data = file && (await getOneImage(file, index, 2));
  if (data) setImageCache(noteID, index, data);
  return data;
}

export async function LoadPDF(
  file: File,
  progressCb?: (percent: number) => void
): Promise<Note> {
  const { images, ratios } = await getPDFImages(file, 0.5, progressCb);
  const pageRec: Record<string, NotePage> = {};
  const pageOrder: string[] = [];
  images.forEach((image, idx) => {
    const pageID = getUid();
    pageRec[pageID] = {
      image,
      ratio: ratios[idx],
      state: {
        strokes: {},
      },
      pdfIndex: idx + 1,
    };
    pageOrder.push(pageID);
  });
  const name = file.name.replace(".pdf", "");
  const ab = await file.arrayBuffer();
  const pdf = new Blob([ab], { type: "application/pdf" });
  return {
    ...createEmptyNote(),
    name,
    withImg: true,
    pdf,
    thumbnail: images[0],
    pageRec,
    pageOrder,
  };
}
