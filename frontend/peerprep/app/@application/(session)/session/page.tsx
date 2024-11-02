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
  propagateMessage,
  openModal,
  closeModal,
  confirmTermination,
} from "@/services/sessionService";
import CollabCodeEditor from "../../../../components/collaboration/CollabCodeEditor";
import { codeOutputInterface } from "@/components/collaboration/Output";
import { useRouter } from "next/navigation";
import { chatMessage } from "@/utils/utils";

const App: React.FC = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<SupportedLanguages>("javascript");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [questionId, setQuestionId] = useState<string>("");
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionCategory, setQuestionCategory] = useState<string[]>([]);
  const [questionDifficulty, setQuestionDifficulty] = useState<string>("None");
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [questionTestcases, setQuestionTestcases] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string[] | null>(null);
  const [isCodeError, setIsCodeError] = useState<boolean>(false);

  const [isModalVisible, setModalVisibility] = useState<boolean>(false);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false); // Is termination cancelled
  const [isFirstToCancel, setIsFirstToCancel] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<chatMessage[]>([]);

  const doc = new Y.Doc();
  const yText = doc.getText("code");
  const updateDoc = (update: Uint8Array) => {
    Y.applyUpdateV2(doc, update);
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
      setUsername,
      setQuestionId,
      setQuestionDescription,
      setQuestionTestcases,
      setQuestionCategory,
      setQuestionDifficulty,
      setQuestionTitle,
      updateDoc,
      setCodeOutput,
      setIsCodeError,
      setIsCancelled,
      setModalVisibility,
      setUserConfirmed,
      setIsFirstToCancel,
      setChatHistory,
      router
    );

    return () => {
      disconnectSocket();
      doc.destroy();
    };
  }, []);

  return (
    <div className="relative flex flex-col w-full h-[90vh] max-w-full overflow-hidden">
      <CollabNavbar
        usersInRoom={usersInRoom}
        username={username}
        setUsersInRoom={setUsersInRoom}
        isModalVisible={isModalVisible}
        userConfirmed={userConfirmed}
        isCancelled={isCancelled}
        isFirstToCancel={isFirstToCancel}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        handleConfirm={handleConfirm}
        setIsCancelled={setIsCancelled}
        propagateMessage={propagateMessage}
        chatHistory={chatHistory}
      />
      <div className="flex flex-row w-full h-full max-w-full">
        <div className="flex w-1/2 h-full">
          <QuestionDisplay
            questionId={questionId}
            questionDifficulty={questionDifficulty}
            questionTitle={questionTitle}
            questionCategory={questionCategory}
            questionDescription={questionDescription}
            testCases={questionTestcases}
            propagateMessage={propagateMessage}
            username={username}
            chatHistory={chatHistory}
          />
        </div>
        <div className="flex w-1/2 h-full overflow-y-auto">
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
