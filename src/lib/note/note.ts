import { getDefaultFlatState, FlatState } from "lib/draw/DrawState";
import { v4 as getUid } from "uuid";
import dayjs from "dayjs";
import introState from "./introState.json";
import { createNewNote } from "./archive";
export interface NotePage {
  ratio: number;
  state: FlatState;
  image?: string;
  marked?: boolean;
  pdfIndex?: number;
}

export const defaultNotePage: Readonly<NotePage> = {
  ratio: 1.5,
  state: { strokes: {} },
};

export interface TeamPageState {
  states: Record<string, FlatState>;
}

export interface TeamPageInfo {
  ratio: number;
  pdfIndex?: number;
}

export type TeamPage = TeamPageInfo & TeamPageState;
export type TeamPageRec = Record<string, TeamPage>;
export interface TeamNote {
  uid: string;
  pageRec: TeamPageRec;
}

export interface NoteInfo {
  uid: string;
  name: string;
  tagID: string;
  team: boolean;
  withImg: boolean;
  createTime: number;
  lastTime: number;
}

export type Note = NoteInfo & {
  pdf?: Blob;
  pageRec: Record<string, NotePage>;
  pageOrder: string[];
};

export interface TeamNoteInfo {
  uid: string;
  name: string;
  pageOrder: string[];
  withImg: boolean;
}

export function createEmptyNote(): Note {
  const pageID = getUid();
  const time = Date.now();
  return {
    uid: getUid(),
    name: `Note ${dayjs(time).format("HH:mm, ddd MMM D")}`,
    tagID: "DEFAULT",
    team: false,
    withImg: false,
    createTime: time,
    lastTime: time,
    pageRec: {
      [pageID]: {
        ratio: 1.5,
        state: getDefaultFlatState(),
      },
    },
    pageOrder: [pageID],
  };
}

export function createPage(page?: NotePage): [string, NotePage] {
  const pageID = getUid();
  const newPage = page ?? {
    ratio: 1.5,
    state: getDefaultFlatState(),
  };
  return [pageID, newPage];
}

export function removePageTimg(pageRec: Record<string, NotePage>) {
  Object.values(pageRec).forEach((page) => {
    delete page.image;
    delete page.marked;
  });
}

export function createIntroNote() {
  const key = "INTRO_CREATED";
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, "CREATED");
  const note = createEmptyNote();
  note.name = "Welcome to Multibility!";
  const firstPageRec = Object.values(note.pageRec)[0];
  if (!firstPageRec) return;
  firstPageRec.state = JSON.parse(introState);
  createNewNote(note);
}
