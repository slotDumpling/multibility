import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { v4 as getUid } from "uuid";
import { Note, NotePage } from "./note";
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
  console.log(viewport);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("can't get virtual canvas context");
  }

  const { height, width } = viewport;
  const ratio = height / width;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  console.time('render')
  await page.render({
    canvasContext: context,
    viewport: viewport,
    transform: [scale, 0, 0, scale, 0, 0],
  }).promise;
  console.timeEnd('render')

  console.time('img')
  const blob = await getCanvasBlob(canvas);
  if (!blob) {
    throw new Error("can't get canvas image blob");
  }
  console.timeEnd('img')
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
    if (progressCb) progressCb(Math.floor(i / numPages * 100));
  }

  const [thumbnail] = await getPageImage(pdf, 1, 0.5);

  return {
    images: blobs,
    ratios,
    thumbnail,
  };
}

export async function LoadPDF(
  file: File,
  progressCb?: (percent: number) => void
): Promise<Note> {
  const url = URL.createObjectURL(file);
  const { images, ratios, thumbnail } = await getImages(url, 2, progressCb);
  const pages: Record<string, NotePage> = {};
  images.forEach((image, idx) => {
    pages[getUid()] = {
      image,
      ratio: ratios[idx],
      state: {
        strokes: [],
        position: [],
      },
    };
  });
  const name = file.name.replace(".pdf", "");
  return {
    uid: getUid(),
    name,
    tagId: "DEFAULT",
    team: false,
    withImg: true,
    pdf: file,
    thumbnail,
    pages,
  };
}
