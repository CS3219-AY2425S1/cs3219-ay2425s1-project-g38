import React, { useEffect, useState } from "react";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import BoxIcon from "../boxicons";

import { useUniqueCategoriesFetcher } from "@/services/questionService";
import { capitalize } from "@/utils/utils";

interface StartSessionProps {
  isConnected: boolean;
  onClose: () => void;
  isOpen: boolean;
  isMatching: boolean;
  matchmakingTime: number;
  handleStop: () => void;
  handleContinue: (difficulty: Set<string>, topic: Set<string>) => void;
}

// Maybe pass these in as props? Need to be dynamically retrieved from question-service
const difficulties = ["Easy", "Medium", "Hard"];

const MatchmakingModal: React.FC<StartSessionProps> = ({
  isConnected,
  onClose,
  isOpen,
  isMatching,
  matchmakingTime,
  handleStop,
  handleContinue,
}) => {
  const { categoryData, categoryError, categoryLoading } =
    useUniqueCategoriesFetcher();

  const uniqueCategories = React.useMemo(() => {
    return categoryData?.uniqueCategories;
  }, [categoryData?.uniqueCategories]);

  // Using sets here in case we want to add multiple criteria matchmaking in the future

  //TODO: Load difficulty and topic from the question-service
  const [selectedDifficultyKeys, setSelectedDifficultyKeys] = useState(
    new Set<string>()
  );
  const [selectedTopicKeys, setSelectedTopicKeys] = useState(new Set<string>());

  const handleDifficultyChange = (keys: any) => {
    if (new Set(keys).size >= 1) {
      // Stops empty selection
      setSelectedDifficultyKeys(new Set(keys));
    }
  };

  const handleTopicChange = (keys: any) => {
    if (new Set(keys).size >= 1) {
      // Stops empty selection
      setSelectedTopicKeys(new Set(keys));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="font-sans flex flex-col pt-8">
          <p className="text-xl font-bold pb-2">
            {isMatching ? "Matchmaking in progress" : "Start a new session"}
          </p>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            {isMatching
              ? "Hold on as we find someone for you..."
              : "Choose the topic, difficulty and we will match you with someone else!"}
          </p>
          {isMatching && <Spinner color="secondary" className="pt-5" />}
          {isMatching && (
            <p className="text-base place-content-centre font-normal text-gray-500 dark:text-gray-400">
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
            showScrollIndicators={true}
            popoverProps={{ placement: "bottom", shouldFlip: false }}
            selectionMode="multiple"
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
            isLoading={categoryLoading}
            selectedKeys={selectedTopicKeys}
            onSelectionChange={handleTopicChange}
            classNames={{ label: "font-bold" }}
            radius="sm"
            size="lg"
            isDisabled={isMatching}
            showScrollIndicators={true}
            popoverProps={{ placement: "bottom", shouldFlip: false }}
            isInvalid={categoryError}
            errorMessage={categoryError ? "Error loading categories" : ""}
            selectionMode="multiple"
          >
            {uniqueCategories && uniqueCategories.length > 0
              ? uniqueCategories.map((category: any) => (
                  <SelectItem key={category}>{capitalize(category)}</SelectItem>
                ))
              : null}
          </Select>
        </ModalBody>
        <ModalFooter className="flex flex-col pb-8 pt-3 pl-5 pr-5">
          {!isConnected && (
            <div className="text-danger bg-danger bg-opacity-10 p-2 flex items-center rounded-full ">
              <BoxIcon name="bx-error pr-2" size="32px" />
              Matchmaking Service is currently unavailable. Please try again
              later.
            </div>
          )}
          <div className="flex flex-row items-center gap-1 pt-3">
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
              onClick={() =>
                handleContinue(selectedDifficultyKeys, selectedTopicKeys)
              }
              isDisabled={
                isMatching ||
                !isConnected ||
                selectedDifficultyKeys.size === 0 ||
                selectedTopicKeys.size === 0
              }
            >
              Continue
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchmakingModal;
