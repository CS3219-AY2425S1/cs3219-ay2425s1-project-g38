import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import React from "react";

import BoxIcon from "./boxicons";

interface ErrorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
  onRetry?: () => void; // Optional callback for retrying the failed action
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onOpenChange,
  errorMessage,
  // onRetry,
}) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1 items-center gap-4">
              <div className="text-danger bg-danger bg-opacity-10 p-1 flex items-center rounded-full justify-center w-12 h-12">
                <BoxIcon name="bx-error" size="32px" />
              </div>
              Error
            </ModalHeader>
            <ModalBody>{errorMessage}</ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
