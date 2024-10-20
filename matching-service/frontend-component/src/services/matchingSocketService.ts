import { io, Socket } from "socket.io-client";

const MATCHING_SERVICE_URL = 'http://localhost:8002'; // TODO: Replace withe environment variable
let socket: Socket | null = null;

const createSocketConnection = (token: string): Socket => {
  const socketConnection = io(MATCHING_SERVICE_URL, {
    auth: { token },
    autoConnect: false,  // We'll connect it manually
    reconnectionAttempts: 5, // Retry connection 5 times if it fails
    timeout: 10000,      // Timeout after 10 seconds
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
export const initializeSocket = () => {
  const token = localStorage.getItem('jwt') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RVc2VyIiwiaWF0IjoxNzI3MDA3MjcwfQ.ycyOdF8eGSfjJXusP39SW1NefMyNNbORvrbtcmdQE6I'  // TODO: Replace with real JWT token
  socket = createSocketConnection(token);
  socket.connect();
};

// Function to register the user for matchmaking
export const registerUser = (
  userParams: any,
  onMatchFound: (matchData: any) => void,
  onRegistrationSuccess: () => void,
  onError: (error: any) => void
) => {
  if (!socket) {
    console.error("Socket not initialized");
    return;
  }

  // Register event listener for matchFound and registrationSuccess
  socket.on("matchFound", (matchData) => {
    onMatchFound(matchData);
  });

  socket.on("registrationSuccess", () => {
    onRegistrationSuccess();
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
