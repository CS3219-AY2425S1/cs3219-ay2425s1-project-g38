import { Spacer, Badge, Button } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface MatchErrorProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const MatchErrorModal: React.FC<MatchErrorProps> = ({
  children,
  onClose,
  isOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="font-sans flex flex-col pt-8">
          <p className="text-xl font-bold pb-2">Matchmaking Error!</p>
        </ModalHeader>
        <ModalBody>
          <Badge variant="flat" color="warning">
            {children}
          </Badge>
          <Spacer y={1} />
          <p />
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            className="flex-1 mx-1"
            radius="sm"
            size="lg"
            onClick={() => onClose()}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchErrorModal;
