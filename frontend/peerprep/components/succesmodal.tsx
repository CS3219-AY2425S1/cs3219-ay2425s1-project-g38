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

interface SuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onConfirm?: () => void; // Optional callback for further actions after confirmation
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onOpenChange,
  message,
  onConfirm,
}) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1 items-center gap-4">
              <div className="text-success bg-success bg-opacity-10 p-1 flex items-center rounded-full justify-center w-12 h-12">
                <BoxIcon name="bx-check-circle" size="32px" />
              </div>
              Success!
            </ModalHeader>
            <ModalBody>{message}</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  if (onConfirm) onConfirm(); // If there's a callback, trigger it
                  onClose(); // Close the modal
                }}
              >
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
