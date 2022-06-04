import { Note, NoteInfo, NotePage, TeamNoteInfo, TeamPageInfo } from "./note";
import { getDefaultFlatState } from "../draw/DrawState";
import localforage from "localforage";
import { v4 as getUid } from "uuid";
import { pickBy } from "lodash-es";
import moment from "moment";

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

export async function addNewTag(name: string, color: string) {
  const uid = getUid();
  const newTag: NoteTag = {
    uid,
    name,
    color,
    notes: [],
  };
  const prevTags = await getAllTags();
  const tags = { ...prevTags, [uid]: newTag };
  await localforage.setItem("ALL_TAGS", tags);

  return tags;
}

export async function deleteTag(uid: string) {
  const prevTags = await getAllTags();
  const { [uid]: _, ...tags } = prevTags;
  await localforage.setItem("ALL_TAGS", tags);

  return tags;
}

export async function editTag(tag: NoteTag) {
  const prevTags = await getAllTags();
  const tags = { ...prevTags, [tag.uid]: tag };
  await localforage.setItem("ALL_TAGS", tags);
  return tags;
}

export async function loadNote(uid: string) {
  const note = (await localforage.getItem(uid)) as Note | undefined;
  if (!note) return;
  const pdf = (await localforage.getItem(`PDF_${uid}`)) as Blob | undefined;
  return { ...note, pdf };
}

export async function editNoteData(uid: string, noteData: Partial<Note>) {
  noteData = pickBy(noteData, (v) => v !== undefined);
  if ("pageRec" in noteData) noteData.lastTime = moment.now();
  console.dir(noteData);

  const allNotes = await getAllNotes();
  const { pageRec, pageOrder, ...noteInfo } = noteData;
  allNotes[uid] = { ...allNotes[uid], ...noteInfo };

  await localforage.setItem("ALL_NOTES", allNotes);
  const prevNote = await loadNote(uid);
  if (!prevNote) return;
  await localforage.setItem(uid, { ...prevNote, ...noteData });
}

export async function saveNoteInfo(noteInfo: NoteInfo) {
  const { uid, tagID } = noteInfo;
  const allNotes = await getAllNotes();
  allNotes[uid] = noteInfo;
  await localforage.setItem("ALL_NOTES", allNotes);
  const tags = await getAllTags();
  if (tagID in tags) {
    tags[tagID].notes.push(noteInfo.uid);
    await localforage.setItem("ALL_TAGS", tags);
  }
  return { tags, allNotes };
}

export async function createNewNote(noteWithPdf: Note) {
  const { pdf, ...note } = noteWithPdf;
  await localforage.setItem(note.uid, note);
  if (pdf) await localforage.setItem(`PDF_${note.uid}`, pdf);
  const { pageRec, pageOrder, ...noteInfo } = note;
  return await saveNoteInfo(noteInfo);
}

export async function deleteNote(uid: string) {
  const note = await loadNote(uid);
  const allNotes = await getAllNotes();
  const tags = await getAllTags();
  if (!note) return { tags, allNotes };
  await localforage.removeItem(uid);
  await localforage.removeItem(`PDF_${uid}`);
  delete allNotes[uid];
  await localforage.setItem("ALL_NOTES", allNotes);

  const { tagID } = note;
  if (tagID in tags) {
    const prevTag = tags[tagID];
    prevTag.notes = prevTag.notes.filter((id) => id !== uid);
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
    const prevTag = tags[prevTagId];
    prevTag.notes = prevTag.notes.filter((id) => id !== noteID);
  }
  tags[tagID]?.notes.push(noteID);
  await localforage.setItem("ALL_TAGS", tags);
  return { tags, allNotes };
}

export async function saveTeamNote(
  noteID: string,
  noteInfo: TeamNoteInfo,
  teamPages: Record<string, TeamPageInfo>,
  file?: Blob
) {
  let note = await loadNote(noteID);
  if (note) return;
  const time = moment.now();
  const pageRec: Record<string, NotePage> = {};
  note = {
    ...noteInfo,
    tagID: "DEFAULT",
    team: true,
    pageRec,
    pdf: file,
    createTime: time,
    lastTime: time,
  };

  // set empty state for each page
  Object.entries(teamPages).forEach(([pageID, page]) => {
    pageRec[pageID] = { ...page, state: getDefaultFlatState() };
  });

  // parse timg for each page
  if (file) {
    const { getPDFImages } = await import("../note/pdfImage");
    const { images } = await getPDFImages(file);
    Object.values(pageRec).forEach((page) => {
      const { pdfIndex } = page;
      if (!pdfIndex) return;
      page.image = images[pdfIndex - 1];
    });
    note.thumbnail = images[0];
  }

  await createNewNote(note);
}

export async function updateTeamNote(
  noteID: string,
  noteInfo: TeamNoteInfo,
  pageInfos: Record<string, TeamPageInfo>
) {
  let note = await loadNote(noteID);
  if (!note) return false;
  const { pageOrder } = noteInfo;
  if (pageOrder.length < note.pageOrder.length) return true;
  const { pageRec, pdf } = note;
  const { getOneImage } = await import("./pdfImage");

  // parse timgs & set empty states for new pages.
  for (let [pageID, page] of Object.entries(pageInfos)) {
    if (pageID in pageRec) continue;
    const { pdfIndex } = page;
    const state = getDefaultFlatState();
    pageRec[pageID] = { ...page, state };
    if (!pdf || !pdfIndex) continue;
    pageRec[pageID].image = await getOneImage(pdf, pdfIndex, 0.5);
  }
  await editNoteData(noteID, { pageOrder, pageRec });
  return true;
}
