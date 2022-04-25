import { io } from "socket.io-client";
import { getUserID, getUserName } from "../user";
import { BASE_URL } from "./http";

export const IoFactory = (noteID: string) => {
  return () =>
    io(BASE_URL, {
      autoConnect: false,
      query: {
        userID: getUserID(),
        userName: getUserName(),
        noteID,
      },
    });
};
