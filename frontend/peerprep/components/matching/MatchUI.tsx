import { useState, useEffect } from "react";

import {
  initializeSocket,
  disconnectSocket,
  registerUser,
  deregisterUser,
  isSocketConnected,
} from "../../services/matchingSocketService";

import MatchFoundModal from "./MatchFoundModal";
import MatchmakingModal from "./MatchmakingModal";
import MatchTimeoutModal from "./MatchTimeoutModal";
import MatchErrorModal from "./MatchErrorModal";

interface MatchUIProps {
  onClose: () => void;
}

enum UIState {
  StartSession = "StartSession",
  MatchFound = "MatchFound",
  MatchingTimeout = "MatchingTimeout",
  MatchingError = "MatchingError",
}

const MatchUI = ({ onClose }: MatchUIProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);
  const [uiState, setUiState] = useState<UIState>(UIState.StartSession);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchmakingTime, setMatchmakingTime] = useState<number>(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

  // Initialize socket on component mount
  useEffect(() => {
    initializeSocket();

    const checkConnection = () => {
      setIsConnected(isSocketConnected());
    };

    const interval = setInterval(checkConnection, 1000);

    // Clean up on component unmount
    return () => {
      disconnectSocket();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsMatching(false);
      if (intervalID) {
        clearInterval(intervalID);
      }
    }
  }, [isConnected, intervalID]);

  const handleMatchingContinue = async (
    selectedDifficultyKeys: Set<string>,
    selectedTopicKeys: Set<string>
  ) => {
    // Set timer for matchmaking
    let time = 1;
    const interval = setInterval(() => {
      setMatchmakingTime(time);
      time += 1;
    }, 1000);

    setIntervalID(interval);
    // Call the register function
    await handleRegisterForMatching(selectedDifficultyKeys, selectedTopicKeys);
    setIsMatching(true);
  };

  const handleMatchingStop = () => {
    handleDeregisterForMatching();
    if (intervalID) {
      clearInterval(intervalID);
    }
    setIsMatching(false);
  };

  const handleMatchingError = (error: any) => {
    console.error("Error during matchmaking:", error);
    if (error === "'User is already registered for matching.") {
      setMatchmakingError("You are already registered for matching.");
    } else {
      setMatchmakingError("An error occurred during matchmaking.");
    }
    setUiState(UIState.MatchingError);
  };

  const handleRegisterForMatching = async (
    difficulty: Set<string>,
    topic: Set<string>
  ) => {
    const userParams = {
      difficulty: Array.from(difficulty),
      topic: Array.from(topic),
    };

    registerUser(
      userParams,
      handleMatchFound,
      () => console.log("Registration successful!"), // Handle success
      handleMatchingTimeout,
      handleMatchingError
    );
  };

  const handleDeregisterForMatching = () => {
    console.log("Deregistering for matching");
    deregisterUser();
  };

  const handleMatchingTimeout = () => {
    console.log("Matching timeout");
    setUiState(UIState.MatchingTimeout);
  };

  const handleMatchFound = (matchData: any) => {
    console.log("Match found with data:", matchData);
    setUiState(UIState.MatchFound);

    // TODO: Redirect to session page
  };

  const closeModal = () => {
    setIsMatchUIVisible(false);
    setUiState(UIState.StartSession);
    onClose();
  };

  return (
    <>
      {isMatchUIVisible && (
        <>
          <MatchmakingModal
            isConnected={isConnected}
            onClose={closeModal}
            isOpen={uiState === UIState.StartSession}
            isMatching={isMatching}
            matchmakingTime={matchmakingTime}
            handleStop={handleMatchingStop}
            handleContinue={handleMatchingContinue}
          />
          <MatchFoundModal
            onClose={closeModal}
            isOpen={uiState === UIState.MatchFound}
          />
          <MatchTimeoutModal
            onClose={closeModal}
            isOpen={uiState === UIState.MatchingTimeout}
          />
          <MatchErrorModal
            onClose={closeModal}
            isOpen={uiState === UIState.MatchingError}
          >
            {matchmakingError || "An error occurred during matchmaking."}
          </MatchErrorModal>
        </>
      )}
    </>
  );
};

export default MatchUI;
