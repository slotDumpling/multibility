import axios from "axios";
import { Note, NoteInfo, NotePage } from "../note/note";
import { convertTeamPage, saveTeamNote } from "../note/archive";
import { cloneDeep } from "lodash";
import { getUserId } from "../user";

export const BASE_URL = "http://100.81.113.84:8090/paint";
axios.defaults.baseURL = BASE_URL;
axios.interceptors.request.use((config) => {
  console.log(config.method, config.url);
  return config;
});

export async function getNoteId(roomCode: number) {
  try {
    const { data } = await axios.get(`code/${roomCode}`);
    if (data.statusCode === 200) {
      const { noteId, pageInfos, noteInfo } = data as {
        noteId: string;
        pageInfos: Record<string, Omit<NotePage, "state">>;
        noteInfo: NoteInfo;
      };
      
      if (noteInfo.withImg) {
        for (let [pageId, page] of Object.entries(pageInfos)) {
          const { data } = await axios({
            method: "GET",
            url: pageId,
            responseType: "blob",
          });
          page.image = data;
        }
      }
      await saveTeamNote(noteId, noteInfo, pageInfos);
      return noteId as string;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const deletePagesPosition = (pageRecord: Record<string, NotePage>) => {
  const pages = cloneDeep(pageRecord);
  for (let key of Object.keys(pages)) {
    delete pages[key].state.position;
  }
  return pages;
};

export async function putNote(
  noteId: string,
  noteInfo: Note,
  pageRecord: Record<string, NotePage>
) {
  pageRecord = deletePagesPosition(pageRecord);
  const { uid, name, withImg, pages } = noteInfo;

  try {
    const { data } = await axios.put(`create/${noteId}`, {
      userId: getUserId(),
      pageRecord,
      noteInfo: { uid, name, withImg },
    });
    if (withImg) {
      Object.entries(pages).forEach(([pageId, page]) => {
        const { image } = page;
        if (!image) return;
        const formData = new FormData();
        formData.append("pageId", pageId);
        formData.append("file", image);
        axios({
          method: "POST",
          url: "upload",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      });
    }
    if (data.statusCode === 201) {
      return data.code as number;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updatePages(
  noteId: string,
  pageRecord: Record<string, NotePage>
) {
  try {
    const { data } = await axios.put(`pages/${noteId}`, {
      userId: getUserId(),
      pageRecord,
    });
    if (data.statusCode === 201) return true;
    else return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getTeamNote(noteId: string) {
  try {
    const { data } = await axios.get(`room/${noteId}`);
    if (data.statusCode === 200) {
      const { teamPages, code, noteInfo: info } = data;
      const pages = await convertTeamPage(teamPages);
      return { code, pages, info };
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
