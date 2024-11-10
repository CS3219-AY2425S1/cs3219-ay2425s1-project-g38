import React, { useState } from "react";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface StartSessionProps {
  handleDeregisterForMatching: () => void;
  handleRegisterForMatching: (
    difficulty: Set<string>,
    topic: Set<string>
  ) => void;
  onClose: () => void;
  isOpen: boolean;
}

// Maybe pass these in as props? Need to be dynamically retrieved from question-service
const difficulties = ["Easy", "Medium", "Hard"];
const topics = ["Dynamic Programming", "Graphs", "Arrays"];

const MatchmakingModal: React.FC<StartSessionProps> = ({
  handleDeregisterForMatching,
  handleRegisterForMatching,
  onClose,
  isOpen,
}) => {
  // Using sets here in case we want to add multiple criteria matchmaking in the future
  const [selectedDifficultyKeys, setSelectedDifficultyKeys] = useState(
    new Set(["Easy"])
  );
  const [selectedTopicKeys, setSelectedTopicKeys] = useState(
    new Set(["Dynamic Programming"])
  );
  const [isMatching, setIsMatching] = useState(false);
  const [matchmakingTime, setMatchmakingTime] = useState<number>(0);

  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

  const handleDifficultyChange = (keys: any) => {
    setSelectedDifficultyKeys(new Set(keys));
  };

  const handleTopicChange = (keys: any) => {
    setSelectedTopicKeys(new Set(keys));
  };

  const handleContinue = async () => {
    // Set timer for matchmaking
    let time = 0;
    const interval = setInterval(() => {
      setMatchmakingTime(time);
      time += 1;
    }, 1000);
    setIntervalID(interval);
    // Call the register function
    await handleRegisterForMatching(selectedDifficultyKeys, selectedTopicKeys);
    setIsMatching(true);
  };

  const handleStop = () => {
    handleDeregisterForMatching();
    if (intervalID) {
      clearInterval(intervalID);
    }
    setIsMatching(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="font-sans flex flex-col pt-8">
          <p className="text-xl font-bold pb-2">
            {isMatching ? "Matchmaking in progress" : "Start a new session"}
          </p>
          <p className="text-base font-normal text-gray-500">
            {isMatching
              ? "Hold on as we find someone for you..."
              : "Choose the topic, difficulty and we will match you with someone else!"}
          </p>
          {isMatching && <Spinner color="secondary" className="pt-5" />}
          {isMatching && (
            <p className="text-base place-content-centre font-normal text-gray-500">
              Matchmaking time: {matchmakingTime}s
            </p>
          )}
        </ModalHeader>
        <ModalBody>
          <Select
            label="Difficulty"
            labelPlacement="outside"
            variant="bordered"
            className="flex flex-col"
            selectedKeys={selectedDifficultyKeys}
            onSelectionChange={handleDifficultyChange}
            classNames={{ label: "font-bold" }}
            radius="sm"
            size="lg"
            isDisabled={isMatching}
          >
            {difficulties.map((diff) => (
              <SelectItem key={diff}>{diff}</SelectItem>
            ))}
          </Select>
          <Select
            label="Topic"
            labelPlacement="outside"
            variant="bordered"
            className="flex flex-col"
            selectedKeys={selectedTopicKeys}
            onSelectionChange={handleTopicChange}
            classNames={{ label: "font-bold" }}
            radius="sm"
            size="lg"
            isDisabled={isMatching}
          >
            {topics.map((top) => (
              <SelectItem key={top}>{top}</SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter className="pb-8 pt-6 pl-5 pr-5">
          <Button
            color={isMatching ? "danger" : "secondary"}
            variant="bordered"
            className="flex-1 mx-1"
            radius="sm"
            size="lg"
            onClick={isMatching ? handleStop : onClose}
          >
            {!isMatching ? "Cancel" : "Stop"}
          </Button>
          <Button
            color="secondary"
            className="flex-1 mx-1"
            radius="sm"
            size="lg"
            onClick={() => handleContinue()}
            isDisabled={isMatching}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchmakingModal;
