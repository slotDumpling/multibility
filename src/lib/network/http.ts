import axios from "axios";
import { Note, NotePage, TeamNoteInfo } from "../note/note";
import {
  convertTeamPage,
  loadNote,
  saveTeamNote,
  updateTeamNote,
} from "../note/archive";
import { getuserID } from "../user";
// import { getPDFImages } from "../note/pdfImage";

export let BASE_URL = "https://api.slotdumpling.top/paint";
BASE_URL = "http://100.81.113.84:8090/paint";
axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use((config) => {
  console.log(config.method, config.url);
  return config;
});

export async function getnoteID(roomCode: number) {
  try {
    const { data } = await axios.get(`code/${roomCode}`);
    console.log({ data });
    if (data.statusCode !== 200) return null;
    return data.noteID as string;
  } catch (e) {
    console.error(e);
    return null;
  }
}

interface InfoRes {
  statusCode: number;
  code: number;
  noteInfo: TeamNoteInfo & Partial<Note>;
  pageInfos: Record<string, NotePage>;
}

export async function getTeamNoteInfo(noteID: string) {
  try {
    const { data } = await axios.get(`info/${noteID}`);
    const { statusCode, ...res } = data as InfoRes;
    if (statusCode !== 200) return null;
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function loadTeamNoteInfo(noteID: string) {
  try {
    const infoRes = await getTeamNoteInfo(noteID);
    if (!infoRes) return null;
    const { noteInfo, pageInfos } = infoRes;

    if (await updateTeamNote(noteID, noteInfo, pageInfos)) return infoRes;

    let file: Blob | undefined = undefined;
    if (noteInfo.withImg) {
      const { data } = await axios({
        method: "GET",
        url: noteID,
        responseType: "blob",
      });
      console.log(data);
      file = new Blob([data], { type: "application/pdf" });

      const { getPDFImages } = await import("../note/pdfImage");
      const { images } = await getPDFImages(file);
      for (let page of Object.values(pageInfos)) {
        const { pdfIndex } = page;
        if (!pdfIndex) continue;
        page.image = images[pdfIndex - 1];
      }
      noteInfo.thumbnail = images[0];
    }
    await saveTeamNote(noteID, noteInfo, pageInfos, file);
    return infoRes;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function putNote(noteID: string) {
  const note = await loadNote(noteID);
  if (!note) return null;
  const { uid, name, withImg, pdf, pageOrder, pageRec } = note;

  try {
    const { data } = await axios.put(`create/${noteID}`, {
      userID: getuserID(),
      pageRec,
      noteInfo: { uid, name, withImg, pageOrder },
    });

    if (pdf) {
      const formData = new FormData();
      const ab = await pdf.arrayBuffer();
      const file = new Blob([ab]);
      formData.append("file", file, noteID);
      await axios({
        method: "POST",
        url: "upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    if (data.statusCode !== 201) return null;
    return data.code as number;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updatePages(noteID: string) {
  const note = await loadNote(noteID);
  if (!note) return null;
  const { uid, name, withImg, pageOrder, pageRec } = note;
  try {
    const { data } = await axios.put(`update/${noteID}`, {
      userID: getuserID(),
      pageRec,
      noteInfo: { uid, name, withImg, pageOrder },
    });
    if (data.statusCode === 201) return true;
    else return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getTeamNoteState(noteID: string) {
  try {
    const { data } = await axios.get(`state/${noteID}`);
    if (data.statusCode !== 200) return null;
    const { teamPages } = data;
    const pageRec = await convertTeamPage(noteID, teamPages);
    return pageRec;
  } catch (e) {
    console.error(e);
    return null;
  }
}
