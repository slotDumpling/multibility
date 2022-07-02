import localforage from "localforage";

const IMAGE_CACHE_MAX = 10;
const imageForage = localforage.createInstance({ name: "imageForage" });
export const getImageCache = async (noteID: string, index: number) => {
  let cacheList = (await imageForage.getItem<string[]>("LIST")) ?? [];
  const key = `${noteID}_${index}`;
  if (!cacheList.includes(key)) return;
  cacheList = [key, ...cacheList.filter((id) => id !== key)];
  await imageForage.setItem("LIST", cacheList);
  return await imageForage.getItem<string>(key);
};

export const setImageCache = async (noteID: string, index: number, data: string) => {
  let cacheList = (await imageForage.getItem<string[]>("LIST")) ?? [];
  const key = `${noteID}_${index}`;
  cacheList = [key, ...cacheList.filter((id) => id !== key)];
  if (cacheList.length > IMAGE_CACHE_MAX) {
    cacheList = cacheList.slice(0, IMAGE_CACHE_MAX);
  }
  await imageForage.setItem("LIST", cacheList);
  await imageForage.setItem(key, data);
  removeUnusedCache();
};

const removeUnusedCache = async () => {
  const cacheList = (await imageForage.getItem<string[]>("LIST")) ?? [];
  const set = new Set(cacheList);
  const allKeys = await imageForage.keys();
  for (let key of allKeys) {
    if (key === "LIST") continue;
    if (!set.has(key)) await imageForage.removeItem(key);
  }
};

export const clearImageCache = () => imageForage.clear();
