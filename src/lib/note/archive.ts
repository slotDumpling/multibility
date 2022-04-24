import {
  Note,
  NoteInfo,
  NotePage,
  TeamNote,
  TeamNoteInfo,
  TeamPageState,
} from "./note";
import { getDefaultFlatState } from "../draw/DrawState";
import { getRandomColor } from "../color";
import localforage from "localforage";
import { v4 as getUid } from "uuid";
import { getuserID } from "../user";

export interface NoteTag {
  uid: string;
  name: string;
  color: string;
  notes: string[];
}

export async function getAllNotes() {
  const allNotes = await localforage.getItem("ALL_NOTES");
  if (allNotes) {
    return allNotes as Record<string, NoteInfo>;
  } else {
    localforage.setItem("ALL_NOTES", {});
    return {};
  }
}

export async function getAllTags() {
  const tags = await localforage.getItem("ALL_TAGS");
  if (tags) {
    return tags as Record<string, NoteTag>;
  } else {
    localforage.setItem("ALL_TAGS", {});
    return {};
  }
}

export async function storeTag(name: string) {
  const uid = getUid();
  const newTag: NoteTag = {
    uid,
    name,
    color: getRandomColor(),
    notes: [],
  };
  const tags: Record<string, NoteTag> = {
    ...(await getAllTags()),
    [uid]: newTag,
  };
  await localforage.setItem("ALL_TAGS", tags);

  return tags;
}

export async function deleteTag(uid: string) {
  const tags = await getAllTags();
  delete tags[uid];
  await localforage.setItem("ALL_TAGS", tags);

  return tags;
}

export async function editTag(tag: NoteTag) {
  const tags = await getAllTags();
  const editedTag = tags[tag.uid];
  editedTag.name = tag.name;
  editedTag.color = tag.color;
  editedTag.notes = tag.notes;
  await localforage.setItem("ALL_TAGS", tags);
  return tags;
}

export async function loadNote(uid: string) {
  const note = (await localforage.getItem(uid)) as Note | undefined;
  if (!note) return;
  const pdf = (await localforage.getItem(`PDF_${uid}`)) as Blob | undefined;
  return { ...note, pdf };
}

export async function editNoteData(uid: string, noteDate: Partial<Note>) {
  console.log("edit note data", noteDate);
  const allNotes = await getAllNotes();
  const { pageRec, ...noteInfo } = noteDate;
  allNotes[uid] = { ...allNotes[uid], ...noteInfo };

  await localforage.setItem("ALL_NOTES", allNotes);
  const prevNote = await loadNote(uid);
  if (!prevNote) return;
  await localforage.setItem(uid, { ...prevNote, ...noteDate });
}

export async function saveNoteInfo(noteInfo: NoteInfo) {
  const { uid, tagID } = noteInfo;
  const allNotes = await getAllNotes();
  allNotes[uid] = noteInfo;
  await localforage.setItem("ALL_NOTES", allNotes);
  const tags = await getAllTags();
  if (tagID !== "DEFAULT") {
    tags[tagID].notes.push(noteInfo.uid);
    await localforage.setItem("ALL_TAGS", tags);
  }
  return { tags, allNotes };
}

export async function createNewNote(noteWithPdf: Note) {
  const { pdf, ...note } = noteWithPdf;
  await localforage.setItem(note.uid, note);
  if (pdf) await localforage.setItem(`PDF_${note.uid}`, pdf);
  const { pageRec, ...noteInfo } = note;
  return await saveNoteInfo(noteInfo);
}

export async function deleteNote(uid: string) {
  const note = await loadNote(uid);
  const allNotes = await getAllNotes();
  const tags = await getAllTags();
  if (!note) return { tags, allNotes };
  await localforage.removeItem(uid);
  await localforage.removeItem(`PDF_${uid}`);
  const { tagID } = note;
  delete allNotes[uid];
  await localforage.setItem("ALL_NOTES", allNotes);

  if (tagID !== "DEFAULT") {
    const { notes } = tags[tagID];
    tags[tagID].notes = notes.filter((id) => id !== uid);
    await localforage.setItem("ALL_TAGS", tags);
  }
  return { tags, allNotes };
}

export async function moveNoteTag(noteID: string, tagID: string) {
  const note = await loadNote(noteID);
  const allNotes = await getAllNotes();
  const tags = await getAllTags();
  if (!note) return { tags, allNotes };

  const { tagID: prevTagId } = note;
  note.tagID = tagID;
  await localforage.setItem(noteID, note);
  allNotes[noteID].tagID = tagID;
  await localforage.setItem("ALL_NOTES", allNotes);

  if (prevTagId in tags) {
    tags[prevTagId].notes = tags[prevTagId].notes.filter((id) => id !== noteID);
  }
  tags[tagID]?.notes?.push(noteID);
  await localforage.setItem("ALL_TAGS", tags);
  return { tags, allNotes };
}

export async function convertTeamPage(
  noteID: string,
  teamPages: Record<string, TeamPageState>
): Promise<TeamNote | undefined> {
  const pageRec = (await loadNote(noteID))?.pageRec;
  if (!pageRec) return;
  const teamNote: TeamNote = { uid: noteID, pageRec: {} };
  for (let [key, page] of Object.entries(teamPages)) {
    const { states } = page;
    const { ratio } = pageRec[key];
    if (!ratio) continue;
    delete states[getuserID()];
    teamNote.pageRec[key] = {
      ratio,
      states,
    };
  }
  return teamNote;
}

export async function saveTeamNote(
  noteID: string,
  noteInfo: TeamNoteInfo,
  teamPages: Record<string, NotePage>,
  pdf?: Blob
) {
  let note = await loadNote(noteID);
  if (note) return;
  for (let page of Object.values(teamPages)) {
    page.state = getDefaultFlatState();
  }
  note = {
    ...noteInfo,
    tagID: "DEFAULT",
    team: true,
    pageRec: teamPages,
    pdf,
  };
  await createNewNote(note);
}

export async function updateTeamNote(
  noteID: string,
  noteInfo: TeamNoteInfo,
  pageInfos: Record<string, NotePage>
) {
  let note = await loadNote(noteID);
  if (!note) return false;
  const { pageOrder } = noteInfo;
  if (pageOrder.length < note.pageOrder.length) return true;
  const { pageRec, pdf } = note;
  const { getOneImage } = await import('./pdfImage');
  for (let [pageID, page] of Object.entries(pageInfos)) {
    if (!(pageID in pageRec)) {
      const { ratio, pdfIndex } = page;
      let image: string | undefined = undefined;
      if (pdf && pdfIndex) {
        image = await getOneImage(pdf, pdfIndex, 0.5);
      }
      pageRec[pageID] = {
        ratio,
        state: getDefaultFlatState(),
        pdfIndex,
        image,
      };
    }
  }
  await editNoteData(noteID, { pageOrder, pageRec });
  return true;
}
