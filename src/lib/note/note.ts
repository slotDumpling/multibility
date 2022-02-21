import { defaultFlatState, FlatState, Stroke } from "../draw/DrawState";
import { v4 as getUid } from "uuid";

export interface NotePage {
  image?: Blob;
  ratio: number;
  state: FlatState;
}

export interface TeamPage {
  ratio: number;
  states: Record<string, Stroke[]>
}

export interface TeamNote {
  uid: string;
  pages: Record<string, TeamPage>
}

export interface NoteInfo {
  uid: string;
  name: string;
  tagId: string;
  team: boolean;
  withImg: boolean;
  createTime?: Date;
  lastTime?: Date;
  thumbnail?: Blob;
}

export type Note = NoteInfo & {
  pdf?: File;
  pages: Record<string, NotePage>;
};

export function createEmptyNote(): Note {
  return {
    uid: getUid(),
    name: `New note ${Date.now()}`,
    tagId: "DEFAULT",
    team: false,
    withImg: false,
    pages: {
      [getUid()]: {
        ratio: 1.5,
        state: defaultFlatState,
      },
    },
  };
}
