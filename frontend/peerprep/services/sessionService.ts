import io from "socket.io-client";
import { env } from "next-runtime-env";
import { Dispatch } from "react";
import { Socket } from "socket.io-client";

import { getAccessToken } from "../auth/actions";

import { codeOutputInterface } from "@/components/collaboration/Output";

import { chatMessage } from "@/utils/utils";
const NEXT_PUBLIC_COLLAB_SERVICE_URL = env("NEXT_PUBLIC_COLLAB_SOCKET_URL") || env("NEXT_PUBLIC_COLLAB_SERVICE_URL");
const NEXT_PUBLIC_COLLAB_SERVICE_PATH = env("NEXT_PUBLIC_COLLAB_SOCKET_PATH") || "/socket.io";

export let socket: Socket | null = null;

const getToken = async () => {
  const token = await getAccessToken();

  if (!token) {
    console.error("Access token not found");

    return null;
  }

  return token;
};

export const initializeSessionSocket = async (
  setLanguage: Dispatch<any>,
  setUsersInRoom: Dispatch<any>,
  setUsername: Dispatch<any>,
  setQuestionId: Dispatch<any>,
  setQuestionDescription: Dispatch<any>,
  setQuestionTestcases: Dispatch<any>,
  setQuestionCategory: Dispatch<any>,
  setQuestionDifficulty: Dispatch<any>,
  setQuestionTitle: Dispatch<any>,
  updateDoc: (arg0: Uint8Array) => void,
  setCodeOutput: Dispatch<any>,
  setIsCodeError: Dispatch<any>,
  setIsCancelled: Dispatch<any>,
  setModalVisibility: Dispatch<any>,
  setUserConfirmed: Dispatch<any>,
  setIsFirstToCancel: Dispatch<any>,
  setChatHistory: Dispatch<any>,
  router: any
) => {
  const token = await getToken();

  if (!token) return;

  if (socket) {
    return;
  }

  socket = io(NEXT_PUBLIC_COLLAB_SERVICE_URL, {
    path: NEXT_PUBLIC_COLLAB_SERVICE_PATH,
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 20000,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("Connected to session service");
  });

  socket.on("initialData", (data: any) => {
    console.log("Populating initial data");
    const { sessionData } = data;
    setLanguage(sessionData.selectedLanguage);
    console.log("setting language: ", sessionData.language);
    setUsersInRoom(sessionData.usersInRoom);
    console.log("username: ", sessionData.username);
    setUsername(sessionData.username);
    updateDoc(new Uint8Array(sessionData.yDocUpdate));
    setChatHistory(sessionData.chatHistory);

    const question = sessionData.question

    const { question_id, title, description, testCases, category, complexity } = question;

    setQuestionId(question_id);
    setQuestionTitle(title);
    setQuestionDescription(description);
    setQuestionTestcases(testCases[0]);
    setQuestionCategory(category);
    setQuestionDifficulty(complexity);

  });

  registerUserEvents(setUsersInRoom);

  registerEditorEvents(updateDoc, setLanguage);

  registerCodeExecutionEvents(setCodeOutput, setIsCodeError);


  registerTerminationModalEvents(setIsCancelled, setModalVisibility, setUserConfirmed, setIsFirstToCancel, router);

  registerChatEvents(setChatHistory);
};

const registerUserEvents = async (setUsersInRoom: Dispatch<any>) => {
  if (!socket) return;

  socket.on("userJoined", (data: any) => {
    const { usersInRoom } = data;

    setUsersInRoom(usersInRoom);
  });
  socket.on("userLeft", (data: any) => {
    const { usersInRoom } = data;

    setUsersInRoom(usersInRoom);
  });
};

const registerEditorEvents = async (
  updateDoc: (arg0: Uint8Array) => void,
  setLanguage: Dispatch<any>,
) => {
  if (!socket) return;

  socket.on("updateContent", (update: any) => {
    console.log("Received document update", update);
    update = new Uint8Array(update);
    updateDoc(update);
  });

  socket.on("updateLanguage", (updatedLanguage: string) => {
    setLanguage(updatedLanguage);
  });
};

const registerCodeExecutionEvents = async (
  setCodeOutput: Dispatch<any>,
  setIsCodeError: Dispatch<any>,
) => {
  if (!socket) return;

  socket.on("updateOutput", (data: any) => {
    if (data.stderr) {
      setCodeOutput(data.stderr.split("\n"));
      setIsCodeError(true);
    } else {
      setCodeOutput(data.stdout.split("\n"));
      setIsCodeError(false);
    }
  });
};

export const registerTerminationModalEvents = async (setIsCancelled: Dispatch<any>, setModalVisibility: Dispatch<any>, setUserConfirmed: Dispatch<any>, setIsFirstToCancel: Dispatch<any>, router: any) => {
  if (!socket) return;

  socket.on("modalVisibility", (isVisible: boolean) => {
    // console.log("Received modal visibility", isVisible);
    setModalVisibility(isVisible);
    setIsCancelled(!isVisible);

    if (!isVisible) {
      setUserConfirmed(false);
      setIsFirstToCancel(true);
    }
  });

  socket.on("terminateOne", () => {
    console.log("Partner confirmed termination");
    setIsFirstToCancel(false);
  });

  socket.on("terminateSession", () => {
    setModalVisibility(false);
    console.log("Session terminated");
    socket?.disconnect();
    router.push("/");
  });
};

export const registerChatEvents = async (setChatHistory: Dispatch<any>) => {
  if (!socket) return;

  socket.on("chatMessage", (message: any) => {
    // console.log("Received chat message", message);
    setChatHistory((prevChatHistory: any) => [...prevChatHistory, message]);
  });
}

export const disconnectSocket = async () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = async () => {
  return socket ? socket.connected : false;
};

export const propagateCodeOutput = async (codeOutput: codeOutputInterface) => {
  if (!socket) return;
  console.log("Propagating code execution", codeOutput);
  socket.emit("codeExecution", codeOutput);
};

export const propagateLanguage = async (language: string) => {
  if (!socket) return;

  socket.emit("selectLanguage", language);
};

export const propagateDocUpdate = async (update: Uint8Array) => {
  if (!socket) return;
  console.log("Propagating document update", update);
  socket.emit("update", update);
};

export const propagateMessage = async (message: chatMessage) => {
  if (!socket) return;

  // console.log("Propagating chat message", message);
  socket.emit("chatMessage", message);
}

export const openModal = async (setModalVisibility: Dispatch<any>) => {
  if (!socket) return;

  setModalVisibility(true);
  socket.emit("changeModalVisibility", true);
};

export const closeModal = async (
  setModalVisibility: Dispatch<any>,
  setUserConfirmed: Dispatch<any>,
  setIsFirstToCancel: Dispatch<any>,
) => {
  if (!socket) return;

  setModalVisibility(false);
  setUserConfirmed(false);
  setIsFirstToCancel(true);
  socket.emit("changeModalVisibility", false);
};

export const confirmTermination = async (
  isFirstToCancel: boolean,
  router: any,
  setUserConfirmed: Dispatch<any>,
  setModalVisibility: Dispatch<any>,
) => {
  setUserConfirmed(true);
  if (!socket) return;

  if (isFirstToCancel) {
    socket.emit("terminateOne");
  } else {
    setModalVisibility(false);
    socket.emit("terminateSession");
    socket.disconnect();
    router.push("/");
  }
};
