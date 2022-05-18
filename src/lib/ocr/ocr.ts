import { ImageLike, recognize } from "tesseract.js";

export async function recognizePic(pic: ImageLike) {
  console.time('ocr');
  console.log(await recognize(pic))
  console.timeEnd('ocr');
}