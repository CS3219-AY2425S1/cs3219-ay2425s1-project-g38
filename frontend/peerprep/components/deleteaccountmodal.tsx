"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import BoxIcon from "./boxicons";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteAccountModalProps) {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1 items-center gap-4">
              <div className="text-danger bg-danger bg-opacity-10 p-1 flex items-center rounded-full justify-center w-12 h-12">
                <BoxIcon name="bx-error" size="32px" />
              </div>
              Delete Account Permanently?
            </ModalHeader>
            <ModalBody>
              You are about to delete your account permanently, all account
              details will be lost!
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
