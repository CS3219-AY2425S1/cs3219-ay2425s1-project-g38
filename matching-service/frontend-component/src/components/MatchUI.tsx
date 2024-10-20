import { useState, useEffect } from "react";
import MatchFoundModal from "./MatchFoundModal";
import MatchmakingModal from "./MatchmakingModal";
import {
  initializeSocket,
  disconnectSocket,
  registerUser,
  deregisterUser,
} from "../services/matchingSocketService";

interface MatchUIProps {
  onClose: () => void;
}

enum UIState {
  StartSession = "StartSession",
  MatchFound = "MatchFound",
}

const MatchUI = ({ onClose }: MatchUIProps) => {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);
  const [uiState, setUiState] = useState<UIState>(UIState.StartSession);

  // Initialize socket on component mount
  useEffect(() => {
    initializeSocket();

    // Clean up on component unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleRegisterForMatching = async (
    difficulty: Set<string>,
    topic: Set<string>
  ) => {
    const userParams = {
      difficulty: Array.from(difficulty).join(","),
      topic: Array.from(topic).join(","),
    };

    registerUser(
      userParams,
      handleMatchFound,
      () => console.log("Registration successful!"), // Handle success
      (error) => console.error("Error during matchmaking:", error) // Handle error
    );
  };

  const handleDeregisterForMatching = () => {
    console.log("Deregistering for matching");
    deregisterUser();
  };

  const handleMatchFound = (matchData: any) => {
    console.log("Match found");
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
