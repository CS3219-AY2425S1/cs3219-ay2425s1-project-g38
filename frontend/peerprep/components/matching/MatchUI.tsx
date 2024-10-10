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

interface MatchUIProps {
  onClose: () => void;
}

enum UIState {
  StartSession = "StartSession",
  MatchFound = "MatchFound",
}

const MatchUI = ({ onClose }: MatchUIProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);
  const [uiState, setUiState] = useState<UIState>(UIState.StartSession);

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

  const handleRegisterForMatching = async (
    difficulty: Set<string>,
    topic: Set<string>,
  ) => {
    const userParams = {
      difficulty: Array.from(difficulty).join(","),
      topic: Array.from(topic).join(","),
    };

    registerUser(
      userParams,
      handleMatchFound,
      () => console.log("Registration successful!"), // Handle success
      (error) => {
        console.error("Error during matchmaking:", error); // Handle error
      },
    );
  };

  const handleDeregisterForMatching = () => {
    console.log("Deregistering for matching");
    deregisterUser();
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
            handleRegisterForMatching={handleRegisterForMatching}
            handleDeregisterForMatching={handleDeregisterForMatching}
            isConnected={isConnected}
            onClose={closeModal}
            isOpen={uiState === UIState.StartSession}
          />
          <MatchFoundModal
            onClose={closeModal}
            isOpen={uiState === UIState.MatchFound}
          />
        </>
      )}
    </>
  );
};

export default MatchUI;
