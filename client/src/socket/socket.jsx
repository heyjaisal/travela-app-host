import { io } from "socket.io-client";


const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect_error", (err) => {
  console.error("[Socket.IO] Connection error:", err.message);
});

export default socket;
