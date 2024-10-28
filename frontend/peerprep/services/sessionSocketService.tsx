import io from "socket.io-client";
import { getAccessToken } from "../auth/actions";
import { env } from "next-runtime-env";

const NEXT_PUBLIC_COLLAB_SERVICE_URL = env("NEXT_PUBLIC_COLLAB_SERVICE_URL");

const getToken = async () => {
  const token = await getAccessToken();

  if (!token) {
    console.error("Access token not found");
    return null;
  }
  return token;
};

const initializeSocket = async () => {
  const token = await getToken();
  if (!token) return;

  const socket = io(NEXT_PUBLIC_COLLAB_SERVICE_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 20000,
  });

  return socket;
};

export const socket = initializeSocket();
