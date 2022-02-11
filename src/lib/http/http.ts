import { BASE_URL } from "../socket/io";
import { v4 as getUid } from "uuid";
import axios from "axios";
import { NoteInfo, NotePage } from "../note/note";
import { convertTeamPage, saveTeamNote } from "../note/archive";
import { cloneDeep } from "lodash";
axios.defaults.baseURL = BASE_URL;
axios.interceptors.request.use((config) => {
  console.log(config.method, config.url);
  return config;
});

export const getUserId = (() => {
  let cached: string;
  return () => {
    if (cached) return cached;
    let userId = localStorage.getItem("user_id");
    if (!userId) {
      userId = getUid();
      localStorage.setItem("user_id", userId);
    }
    cached = userId;
    return userId;
  };
})();

export async function getNoteId(roomCode: number) {
  try {
    const { data } = await axios.get(`code/${roomCode}`);
    if (data.statusCode === 200) {
      const { noteId, pageInfos, noteInfo } = data;
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
  noteInfo: NoteInfo,
  pageRecord: Record<string, NotePage>
) {
  pageRecord = deletePagesPosition(pageRecord);
  const { uid, name } = noteInfo;

  try {
    const { data } = await axios.put(`create/${noteId}`, {
      userId: getUserId(),
      pageRecord,
      noteInfo: { uid, name },
    });
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
