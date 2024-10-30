import io from "socket.io-client";
import { env } from "next-runtime-env";

import { getAccessToken } from "../auth/actions";
import { Dispatch } from "react";
import { Socket } from "socket.io-client";
import { codeOutputInterface } from "@/components/collaboration/Output";
const NEXT_PUBLIC_COLLAB_SERVICE_URL = env("NEXT_PUBLIC_COLLAB_SERVICE_URL");

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
  setQuestionDescription: Dispatch<any>,
  setQuestionTestcases: Dispatch<any>,
  updateDoc: (arg0: Uint8Array) => void,
  setCodeOutput: Dispatch<any>,
  setIsCodeError: Dispatch<any>,
  setIsCancelled: Dispatch<any>,
  setModalVisibility: Dispatch<any>,
  setUserConfirmed: Dispatch<any>,
  setIsFirstToCancel: Dispatch<any>,
  router: any
) => {

  const token = await getToken();

  if (!token) return;

  if (socket) {
    return;
  }

  socket = io(NEXT_PUBLIC_COLLAB_SERVICE_URL, {
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
    setLanguage((sessionData.selectedLanguage).toLowerCase());
    setUsersInRoom(sessionData.usersInRoom);
    setQuestionDescription(sessionData.questionDescription);
    setQuestionTestcases(sessionData.questionTestcases);
    updateDoc(new Uint8Array(sessionData.yDocUpdate));
  });

  registerUserEvents(setUsersInRoom);

  registerEditorEvents(updateDoc, setLanguage);

  registerCodeExecutionEvents(setCodeOutput, setIsCodeError);

  registerModalEvents(setIsCancelled, setModalVisibility, setUserConfirmed, setIsFirstToCancel, router);
};

const registerUserEvents = async (setUsersInRoom: Dispatch<any>) => {

  if (!socket) return;

  socket.on("userJoined", (data: any) => {
    const { usersInRoom } = data;

    setUsersInRoom(usersInRoom)
  });
  socket.on("userLeft", (data: any) => {
    const { usersInRoom } = data;

    setUsersInRoom(usersInRoom);
  });
};

const registerEditorEvents = async (updateDoc: (arg0: Uint8Array) => void, setLanguage: Dispatch<any>) => {
  if (!socket) return;

  socket.on("updateContent", (update: any) => {
    update = new Uint8Array(update);
    updateDoc(update);
  });

  socket.on("updateLanguage", (updatedLanguage: string) => {
    setLanguage(updatedLanguage);
  });
}

const registerCodeExecutionEvents = async (setCodeOutput: Dispatch<any>, setIsCodeError: Dispatch<any>) => {
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
}

export const registerModalEvents = async (setIsCancelled: Dispatch<any>, setModalVisibility: Dispatch<any>, setUserConfirmed: Dispatch<any>, setIsFirstToCancel: Dispatch<any>, router: any) => {
  if (!socket) return;

  socket.on("modalVisibility", (isVisible: boolean) => {
    // console.log("Received modal visibility", isVisible);
    setModalVisibility(isVisible);
    setIsCancelled(!isVisible);

    if (!isVisible) {
      setUserConfirmed(false);
      setIsFirstToCancel(true);
    }
  })

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
}

export const disconnectSocket = async () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = async () => {
  return socket ? socket.connected : false;
}

export const propagateCodeOutput = async (codeOutput: codeOutputInterface) => {
  if (!socket) return;
  console.log("Propagating code execution", codeOutput);
  socket.emit("codeExecution", codeOutput);
}

export const propagateLanguage = async (language: string) => {
  if (!socket) return;

  socket.emit("selectLanguage", language);
}

export const propagateDocUpdate = async (update: Uint8Array) => {
  if (!socket) return;
  console.log("Propagating document update", update);
  // socket.emit("update", update);
}

export const openModal = async (setModalVisibility: Dispatch<any>) => {
  if (!socket) return;

  setModalVisibility(true);
  socket.emit("changeModalVisibility", true);
}

export const closeModal = async (setModalVisibility: Dispatch<any>, setUserConfirmed: Dispatch<any>, setIsFirstToCancel: Dispatch<any>) => {
  if (!socket) return;

  setModalVisibility(false);
  setUserConfirmed(false);
  setIsFirstToCancel(true);
  socket.emit("changeModalVisibility", false);
}

export const confirmTermination = async (isFirstToCancel: boolean, router: any, setUserConfirmed: Dispatch<any>, setModalVisibility: Dispatch<any>) => {
  setUserConfirmed(true);
  if (!socket) return;

  if (isFirstToCancel) {
    socket.emit("terminateOne");
  } else {
    setModalVisibility(false);
    socket.emit("terminateSession");
    socket.disconnect();
    router.push("/");
  };
}

