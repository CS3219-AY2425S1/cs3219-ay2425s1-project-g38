"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface TerminateModalProps {
  isModalVisible: boolean;
  userConfirmed: boolean;
  isCancelled: boolean;
  isFirstToCancel: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConfirm: () => void;
  setIsCancelled: (isCancelled: boolean) => void;
}

export default function TerminateModal({
  isModalVisible,
  userConfirmed,
  isCancelled,
  isFirstToCancel,
  handleOpenModal: openModal,
  handleCloseModal: closeModal,
  handleConfirm,
  setIsCancelled,
}: TerminateModalProps) {

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Button className="" variant="flat" color="danger" onClick={openModal}>
        Terminate Session
      </Button>
      <Modal
        isOpen={isModalVisible}
        onClose={closeModal}
        title=""
        aria-labelledby="Termination Modal"
        aria-describedby="Modal to confirm termination of session"
      >
        <ModalContent>
          <ModalHeader className="font-sans flex flex-col pt-8">
            <p className="text-xl font-bold pb-2 text-center">
              Ready to end the session?
            </p>
          </ModalHeader>
          <ModalBody>
            <p className="text-center">
              Both users need to confirm to terminate the session.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row justify-center items-center w-full">
              <Button
                className=""
                variant="flat"
                color="danger"
                onClick={handleConfirm}
                disabled={userConfirmed}
              >
                {userConfirmed
                  ? "Waiting for other user..."
                  : isFirstToCancel
                    ? "Confirm Termination"
                    : "Other user confirmed. Click to confirm."}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCancelled} onClose={() => setIsCancelled(false)}>
        <ModalContent>
          <ModalHeader className="font-sans flex flex-col">
            <p className="text-center">Termination Cancelled.</p>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </div>
  );
}
