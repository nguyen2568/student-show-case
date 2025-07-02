import { io } from "socket.io-client";
import { api } from "./axios";
import ENV from "../config/env"; // Import environment variables

const BASE_URL = ENV.SOCKET_BASE_URL;

export const connectSocket = async (accessToken, refreshToken, refresh) => {


  try {
    const socket = io(BASE_URL, {
      auth: {
        token: `${accessToken}`,
      }
    });

    socket.on("connect_error", async (err) => {
      if (err.message.includes("expired") && refreshToken) {
        try {
          const auth = await refresh();
         
          socket.auth.token = `${auth.accessToken}`;
          socket.connect();
      //     
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          socket.disconnect();
        }
      } else {
        console.error("Socket connection error:", err);
      }
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return socket; // Return the socket instance
  } catch (error) {
    console.error("Error connecting to Socket.IO server:", error);
    throw error; // Throw the error to handle it in the calling code
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
