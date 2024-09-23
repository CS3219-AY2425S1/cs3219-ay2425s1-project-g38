import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import BoxIcon from "./boxicons";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  questionToDelete: { title: string } | null;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, onOpenChange, questionToDelete }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1 items-center gap-4">
              <div className="text-danger bg-danger bg-opacity-10 p-1 flex items-center rounded-full justify-center w-12 h-12">
                <BoxIcon name="bx-error" size="32px" />
              </div>
              Delete Question?
            </ModalHeader>
            <ModalBody>
              You are about to delete the question "{questionToDelete?.title}"
              permanently. Are you sure you want to proceed?
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="danger" onPress={onClose}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};