import { io, Socket } from "socket.io-client";

export const BASE_URL = "https://api.slotdumpling.top/paint";

export const getIO = (() => {
  let ioIns: Socket
  return () => {
    return ioIns ?? io(BASE_URL)
  };
})();
