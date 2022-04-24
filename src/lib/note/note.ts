import { getDefaultFlatState, FlatState } from "../draw/DrawState";
import { v4 as getUid } from "uuid";

export interface NotePage {
  ratio: number;
  state: FlatState;
  image?: string;
  marked?: boolean;
  pdfIndex?: number;
}

export interface TeamPageState {
  states: Record<string, FlatState>;
}

export interface TeamPageInfo {
  ratio: number;
  pdfIndex?: number;
}

export type TeamPage = TeamPageInfo & TeamPageState;

export interface TeamNote {
  uid: string;
  pageRec: Record<string, TeamPage>;
}

export interface NoteInfo {
  uid: string;
  name: string;
  tagId: string;
  team: boolean;
  withImg: boolean;
  createTime?: Date;
  lastTime?: Date;
  thumbnail?: string;
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
  const pageId = getUid();
  return {
    uid: getUid(),
    name: `New note ${Date.now()}`,
    tagId: "DEFAULT",
    team: false,
    withImg: false,
    pageRec: {
      [pageId]: {
        ratio: 1.5,
        state: getDefaultFlatState(),
      },
    },
    pageOrder: [pageId],
  };
}

export function createPage(page?: NotePage): [string, NotePage] {
  const pageId = getUid();
  const newPage = page ?? {
    ratio: 1.5,
    state: getDefaultFlatState(),
  };
  return [pageId, newPage];
}

export function createTeamPage(pageInfo: TeamPageInfo): NotePage {
  return {
    ...pageInfo,
    state: getDefaultFlatState(),
  };
}
