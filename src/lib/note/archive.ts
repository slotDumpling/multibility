import localforage from "localforage";
import { NoteInfo, Note, NotePage, TeamPage } from "./note";
import { v4 as getUid } from "uuid";
import { defaultFlatState } from "../draw/DrawState";
import { getUserId } from "../user";
import { getRandomColor } from "../color";

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
  return (await localforage.getItem(uid)) as Note | undefined;
}

export async function editNoteData(uid: string, note: Partial<Note>) {
  const allNotes = await getAllNotes();
  const { pages, pdf, ...noteInfo } = note;
  allNotes[uid] = { ...allNotes[uid], ...noteInfo };
  await localforage.setItem("ALL_NOTES", allNotes);
  const prevNote = await loadNote(uid);
  if (!prevNote) return;
  await localforage.setItem(uid, { ...prevNote, ...note });
}

export async function saveNoteInfo(noteInfo: NoteInfo) {
  const { uid, tagId } = noteInfo;
  const allNotes = await getAllNotes();
  allNotes[uid] = noteInfo;
  await localforage.setItem("ALL_NOTES", allNotes);
  const tags = await getAllTags();
  if (tagId !== "DEFAULT") {
    tags[tagId].notes.push(noteInfo.uid);
    await localforage.setItem("ALL_TAGS", tags);
  }
  return { tags, allNotes };
}

export async function createNewNote(note: Note) {
  await localforage.setItem(note.uid, note);
  const { pdf, pages, ...noteInfo } = note;
  return await saveNoteInfo(noteInfo);
}

export async function deleteNote(uid: string) {
  const note = await loadNote(uid);
  const allNotes = await getAllNotes();
  const tags = await getAllTags();
  if (!note) return { tags, allNotes };
  await localforage.removeItem(uid);
  const { pdf, pages, ...noteInfo } = note;
  delete allNotes[uid];
  await localforage.setItem("ALL_NOTES", allNotes);

  const { tagId } = noteInfo;
  if (tagId !== "DEFAULT") {
    const { notes } = tags[tagId];
    tags[tagId].notes = notes.filter((id) => id !== uid);
    await localforage.setItem("ALL_TAGS", tags);
  }
  return { tags, allNotes };
}

export async function moveNoteTag(noteId: string, tagId: string) {
  const note = await loadNote(noteId);
  const allNotes = await getAllNotes();
  const tags = await getAllTags();
  if (!note) return { tags, allNotes };

  const { tagId: prevTagId } = note;
  note.tagId = tagId;
  await localforage.setItem(noteId, note);
  allNotes[noteId].tagId = tagId;
  await localforage.setItem("ALL_NOTES", allNotes);

  if (prevTagId in tags) {
    tags[prevTagId].notes = tags[prevTagId].notes.filter((id) => id !== noteId);
  }
  tags[tagId]?.notes?.push(noteId);
  await localforage.setItem("ALL_TAGS", tags);
  return { tags, allNotes };
}

export async function convertTeamPage(teamPages: Record<string, TeamPage>) {
  const notePages: Record<string, NotePage> = {};
  for (let [key, page] of Object.entries(teamPages)) {
    const { ratio, states } = page;
    delete states[getUserId()];
    notePages[key] = {
      ratio,
      state: {
        strokes: Object.values(states).flat(1),
      },
    };
  }
  return notePages;
}

export async function saveTeamNote(
  noteId: string,
  noteInfo: { name: string; uid: string; withImg: boolean },
  teamPages: Record<string, Omit<NotePage, "state">>
) {
  let note = await loadNote(noteId);
  if (!note) {
    const pages: Record<string, NotePage> = {};
    for (let [key, page] of Object.entries(teamPages)) {
      pages[key] = { ...page, state: defaultFlatState };
    }
    note = {
      ...noteInfo,
      tagId: "DEFAULT",
      team: true,
      pages,
    };
    createNewNote(note);
  }
}
