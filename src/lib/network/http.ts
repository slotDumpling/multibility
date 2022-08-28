import axios from "axios";
import {
  removePageTimg,
  TeamNoteInfo,
  TeamPageInfo,
  TeamPageRec,
} from "lib/note/note";
import { loadNote, saveTeamNote, updateTeamNote } from "lib/note/archive";
import { getUserID } from "lib/user";
import localforage from "localforage";
import md5 from "md5";

export const BASE_URL = process.env.REACT_APP_PUBLIC_SERVER_URL ?? "";
// export const BASE_URL = process.env.REACT_APP_LOCAL_SERVER_URL ?? "";
axios.defaults.baseURL = BASE_URL;

export async function getNoteID(roomCode: string) {
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
  noteInfo: TeamNoteInfo;
  pageInfos: Record<string, TeamPageInfo>;
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

    if (noteInfo.withImg) {
      const { data } = await axios({
        method: "GET",
        url: noteID,
        responseType: "blob",
      });
      const file = new Blob([data], { type: "application/pdf" });
      await saveTeamNote(noteID, noteInfo, pageInfos, file);
    } else {
      await saveTeamNote(noteID, noteInfo, pageInfos);
    }
    return infoRes;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function putNote(noteID: string) {
  const note = await loadNote(noteID);
  if (!note) return false;
  const { uid, name, withImg, pdf, pageOrder, pageRec } = note;
  removePageTimg(pageRec);

  try {
    const { data } = await axios.put(`create/${noteID}`, {
      userID: getUserID(),
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

    if (data.statusCode !== 201) return false;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const hashForage = localforage.createInstance({ name: "updateHash" });
export async function updatePages(noteID: string) {
  const note = await loadNote(noteID);
  if (!note) return null;
  const { uid, name, withImg, pageOrder, pageRec } = note;
  removePageTimg(pageRec);
  const noteInfo = { uid, name, withImg, pageOrder };

  const hash = md5(JSON.stringify([pageRec, noteInfo]));
  const lastHash = await hashForage.getItem<string>(noteID);
  if (hash === lastHash) return true;

  try {
    const body = { userID: getUserID(), pageRec, noteInfo };
    const { data } = await axios.put(`update/${noteID}`, body);
    if (data.statusCode !== 201) return false;
    await hashForage.setItem(noteID, hash);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const teamForage = localforage.createInstance({ name: "teamState" });
export async function getTeamNoteState(noteID: string) {
  const cachedState = await loadCachedTeamState(noteID);
  const hash = md5(JSON.stringify(cachedState));

  try {
    const { data } = await axios.get(`state/${noteID}`, {
      params: { userID: getUserID(), hash },
    });
    const { statusCode, modified, teamPages } = data;
    if (statusCode === 200 && modified) {
      await teamForage.setItem(noteID, teamPages);
      return teamPages as TeamPageRec;
    }
    return cachedState;
  } catch (e) {
    console.error(e);
    return cachedState;
  }
}

export async function loadCachedTeamState(noteID: string) {
  return (await teamForage.getItem<TeamPageRec>(noteID)) ?? undefined;
}
