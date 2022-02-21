import { io } from "socket.io-client";
import { getUserId, getUserName } from "../user";
import { BASE_URL } from "./http";

export const IoFactory = (noteId: string) => {
  return () =>
    io(BASE_URL, {
      autoConnect: false,
      query: {
        userId: getUserId(),
        userName: getUserName(),
        noteId,
      },
    });
};
