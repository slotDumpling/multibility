import { io } from "socket.io-client";
import { Stroke } from "lib/draw/DrawState";
import { NotePage } from "lib/note/note";
import { getUserID, getUserName } from "lib/user";
import { BASE_URL } from "./http";

export const IoFactory = (noteID: string) => () =>
  io(BASE_URL, {
    query: {
      userID: getUserID(),
      userName: getUserName(),
      noteID,
    },
  });

export interface ReorderInfo {
  pageOrder: string[];
  prevOrder: string[];
  deleted: boolean;
}

export interface NewPageInfo {
  pageOrder: string[];
  pageID: string;
  newPage: NotePage;
}

export interface SyncInfo {
  stroke: Stroke;
  pageID: string;
}
