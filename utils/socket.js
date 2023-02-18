import { io } from "socket.io-client";
import { socketio_domain } from "../constants";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(socketio_domain, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
