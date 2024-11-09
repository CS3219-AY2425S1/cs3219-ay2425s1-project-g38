import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";

import BoxIcon from "./boxicons";

interface SignOutConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>; // Changed to async to handle the sign-out process
}

export const SignOutConfirmationModal: React.FC<
  SignOutConfirmationModalProps
> = ({ isOpen, onOpenChange, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const handleConfirm = async () => {
    setIsLoading(true); // Set loading to true when the button is clicked
    await onConfirm(); // Await the sign-out process
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1 items-center gap-4">
              <div className="text-danger bg-danger bg-opacity-10 p-1 flex items-center rounded-full justify-center w-12 h-12">
                <BoxIcon name="bx-log-out" size="32px" />
              </div>
              Sign Out?
            </ModalHeader>
            <ModalBody>
              You are about to sign out from your account. Are you sure you want
              to continue?
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleConfirm}
                isLoading={isLoading}
              >
                {isLoading ? "Signing Out..." : "Sign Out"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
