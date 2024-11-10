import { Spacer, Badge, Button } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface MatchTimeoutProps {
  onClose: () => void;
  isOpen: boolean;
}

const MatchTimeoutModal: React.FC<MatchTimeoutProps> = ({
  onClose,
  isOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="font-sans flex flex-col pt-8">
          <p className="text-xl font-bold pb-2">Matchmaking Timeout!</p>
        </ModalHeader>
        <ModalBody>
          <Badge variant="flat" color="warning">
            <p>No matches found. Please try again later.</p>
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

export default MatchTimeoutModal;
