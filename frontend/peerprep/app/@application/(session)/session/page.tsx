"use client";
import { CollabNavbar } from "@/components/collaboration/CollabNavbar";

import QuestionDisplay from "@/components/collaboration/QuestionDisplay";

import * as Y from "yjs";
import { use, useEffect, useState } from "react";
import { SupportedLanguages } from "@/utils/utils";
import {
  disconnectSocket,
  initializeSessionSocket,
  propagateCodeOutput,
  propagateDocUpdate,
  propagateLanguage,
  openModal,
  closeModal,
  confirmTermination,
} from "@/services/sessionService";
import CollabCodeEditor from "../../../../components/collaboration/CollabCodeEditor";
import { codeOutputInterface } from "@/components/collaboration/Output";
import { useRouter } from "next/navigation";

const App: React.FC = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<SupportedLanguages>("javascript");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [questionTestcases, setQuestionTestcases] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string[] | null>(null);
  const [isCodeError, setIsCodeError] = useState<boolean>(false);

  const [isModalVisible, setModalVisibility] = useState<boolean>(false);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false); // Is termination cancelled
  const [isFirstToCancel, setIsFirstToCancel] = useState<boolean>(true);

  const doc = new Y.Doc();
  const yText = doc.getText("code");
  const updateDoc = async (update: Uint8Array) => {
    Y.applyUpdate(doc, update);
  };

  function propagateUpdates(
    docUpdate?: Uint8Array,
    languageUpdate?: SupportedLanguages,
    codeOutput?: codeOutputInterface
  ) {
    if (docUpdate) {
      updateDoc(docUpdate);
      propagateDocUpdate(docUpdate);
    }

    if (languageUpdate) {
      setLanguage(languageUpdate);
      propagateLanguage(languageUpdate);
    }

    if (codeOutput) {
      handleCodeUpdate(codeOutput);
      propagateCodeOutput(codeOutput);
    }
  }

  function handleCodeUpdate(codeOutput: codeOutputInterface) {
    if (codeOutput.stderr) {
      setCodeOutput(codeOutput.stderr.split("\n"));
      setIsCodeError(true);
    } else {
      setCodeOutput(codeOutput.stdout.split("\n"));
      setIsCodeError(false);
    }
  }

  const handleOpenModal = async () => {
    openModal(setModalVisibility);
  };

  const handleCloseModal = async () => {
    closeModal(setModalVisibility, setUserConfirmed, setIsFirstToCancel);
  };

  const handleConfirm = async () => {
    confirmTermination(
      isFirstToCancel,
      router,
      setUserConfirmed,
      setModalVisibility
    );
  };

  useEffect(() => {
    initializeSessionSocket(
      setLanguage,
      setUsersInRoom,
      setQuestionDescription,
      setQuestionTestcases,
      updateDoc,
      setCodeOutput,
      setIsCodeError,
      setIsCancelled,
      setModalVisibility,
      setUserConfirmed,
      setIsFirstToCancel,
      router
    );

    return () => {
      disconnectSocket();
      doc.destroy();
    };
  }, []);

  return (
    <div className="relative flex flex-col h-screen">
      <CollabNavbar
        usersInRoom={usersInRoom}
        setUsersInRoom={setUsersInRoom}
        isModalVisible={isModalVisible}
        userConfirmed={userConfirmed}
        isCancelled={isCancelled}
        isFirstToCancel={isFirstToCancel}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        handleConfirm={handleConfirm}
        setIsCancelled={setIsCancelled}
      />
      <div className="flex flex-row w-full h-[90vh] gap-2">
        <div className="flex w-1/2 h-full">
          <QuestionDisplay
            question={questionDescription}
            testCases={questionTestcases}
          />
        </div>
        <div className="flex w-1/2 h-full">
          <CollabCodeEditor
            language={language}
            yDoc={doc}
            propagateUpdates={propagateUpdates}
            codeOutput={codeOutput}
            isCodeError={isCodeError}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
