import { io, Socket } from "socket.io-client";
import { env } from "next-runtime-env";

import { getAccessToken } from "../auth/actions";

const MATCHING_SERVICE_URL = env("NEXT_PUBLIC_MATCHING_SOCKET_URL") || env("NEXT_PUBLIC_MATCHING_SERVICE_URL");
const MATCHING_SERVICE_PATH = env("NEXT_PUBLIC_MATCHING_SOCKET_PATH") || "/socket.io";
let socket: Socket | null = null;

export const isSocketConnected = () => {
  return socket ? socket.connected : false;
};

const createSocketConnection = (token: string): Socket => {
  const socketConnection = io(MATCHING_SERVICE_URL, {
    path: MATCHING_SERVICE_PATH,
    auth: { token },
    transports: ["websocket"],
    autoConnect: false, // We'll connect it manually
    reconnectionAttempts: 5, // Retry connection 5 times if it fails
    timeout: 10000, // Timeout after 10 seconds
  });

  // Handle connection error (e.g., invalid JWT token)
  socketConnection.on("connect_error", (err) => {
    console.error("Connection failed:", err.message);
  });

  // Handle reconnection attempts
  socketConnection.on("reconnect_attempt", () => {
    console.log("Attempting to reconnect...");
  });

  // Handle reconnection success
  socketConnection.on("reconnect", () => {
    console.log("Reconnected successfully!");
  });

  // Handle disconnection
  socketConnection.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
  });

  return socketConnection;
};

// Function to initialize and connect the socket
export const initializeSocket = async () => {
  const token = await getAccessToken();

  if (!token) {
    console.error("Access token not found");

    return;
  }
  socket = createSocketConnection(token);
  socket.connect();
};

// Function to register the user for matchmaking
export const registerUser = (
  userParams: { difficulty: string[]; topic: string[] },
  onMatchFound: (matchData: any) => void,
  onRedirectToSession: () => void,
  onRegistrationSuccess: () => void,
  onMatchingTimeout: () => void,
  onError: (error: any) => void,
) => {
  if (!socket) {
    console.error("Socket not initialized");

    return;
  }

  // Register event listener for matchFound and registrationSuccess
  socket.on("matchFound", (matchData) => {
    onMatchFound(matchData);
  });

  socket.on("redirectToSession", (body) => {
    console.log("Redirecting to session:", body);
    onRedirectToSession();
  });

  socket.on("registrationSuccess", () => {
    onRegistrationSuccess();
  });

  socket.on("matchingTimeout", () => {
    onMatchingTimeout();
  });

  socket.on("error", (error) => {
    console.error("Error from server:", error);
    onError(error);
  });

  // Emit registerForMatching event to backend
  socket.emit("registerForMatching", userParams);
};

// Function to deregister the user from matchmaking
export const deregisterUser = () => {
  if (!socket) {
    console.error("Socket not initialized");

    return;
  }

  // Emit deregisterForMatching event to backend
  socket.emit("deregisterForMatching");
};

// Function to disconnect the socket and clean up event listeners
export const disconnectSocket = () => {
  if (socket) {
    // Remove all listeners to avoid memory leaks
    socket.off("matchFound");
    socket.off("registrationSuccess");
    socket.off("error");

    socket.disconnect();
    socket = null;
  }
};
