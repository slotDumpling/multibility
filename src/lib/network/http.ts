import axios from "axios";
import { Note, NoteInfo, NotePage } from "../note/note";
import { convertTeamPage, saveTeamNote } from "../note/archive";
import { getUserId } from "../user";
import { loadPDFImages } from "../note/pdfImage";

export const BASE_URL = "https://api.slotdumpling.top/paint";
axios.defaults.baseURL = BASE_URL;
axios.interceptors.request.use((config) => {
  console.log(config.method, config.url);
  return config;
});

export async function getNoteId(roomCode: number) {
  try {
    const { data } = await axios.get(`code/${roomCode}`);
    console.log({ data });
    if (data.statusCode !== 200) return null;
    const { noteId, pageInfos, noteInfo } = data as {
      noteId: string;
      pageInfos: Record<string, Omit<NotePage, "state">>;
      noteInfo: NoteInfo;
    };

    let file: File | undefined = undefined;
    if (noteInfo.withImg) {
      const { data } = await axios({
        method: "GET",
        url: noteId,
        responseType: "blob",
      });
      file = new File([data], noteInfo.name + ".pdf");
      const images = await loadPDFImages(file);
      let index = 0;
      for (let page of Object.values(pageInfos)) {
        page.image = images[index++];
      }
      noteInfo.thumbnail = images[0];
    }
    await saveTeamNote(noteId, noteInfo, pageInfos, file);
    return noteId as string;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function putNote(
  noteId: string,
  noteInfo: Note,
  pageRecord: Record<string, NotePage>
) {
  const { uid, name, withImg, pdf } = noteInfo;

  try {
    const { data } = await axios.put(`create/${noteId}`, {
      userId: getUserId(),
      pageRecord,
      noteInfo: { uid, name, withImg },
    });
    if (pdf) {
      const formData = new FormData();
      formData.append("noteId", noteId);
      formData.append("file", pdf);
      axios({
        method: "POST",
        url: "upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Object.entries(pages).forEach(([pageId, page]) => {
      //   const { image } = page;
      //   if (!image) return;
      //   const formData = new FormData();
      //   formData.append("pageId", pageId);
      //   formData.append("file", image);
      //   axios({
      //     method: "POST",
      //     url: "upload",
      //     data: formData,
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });
      // });
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
