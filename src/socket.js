import { io } from "socket.io-client";
import { SOCKET_URL } from "./api";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],  // force WebSocket upgrade
  withCredentials: true       // allow cookies if needed
});

socket.on("connect", () => {
  console.log("WS connected:", socket.id);
});
socket.on("disconnect", () => {
  console.log("WS disconnected");
});
