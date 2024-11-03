import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import React, { useState } from "react";

import BoxIcon from "./boxicons";
import { EyeFilledIcon } from "./icons";
import { EyeSlashFilledIcon } from "./icons";

interface PasswordConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => Promise<boolean>;
  title?: string;
  description?: string;
}

export const PasswordConfirmationModal: React.FC<
  PasswordConfirmationModalProps
> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Confirm Password",
  description = "Please enter your password to continue",
}) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleConfirm = async () => {
    setIsLoading(true);
    const success = await onConfirm(password);

    if (!success) {
      setIsInvalid(true);
    }
    setIsLoading(false);
    if (success) {
      setPassword("");
      setIsInvalid(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setPassword("");
          setIsInvalid(false);
        }
        onOpenChange(open);
      }}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BoxIcon name="bx-lock-alt" size="24px" />
                {title}
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-500">{description}</p>
              <Input
                autoFocus
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    radius="sm"
                    size="sm"
                    onClick={toggleVisibility}
                    className="focus:outline-none"
                    disabled={isLoading}
                  >
                    {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
                  </Button>
                }
                label="Password"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={password}
                isInvalid={isInvalid}
                errorMessage={
                  isInvalid ? "Incorrect password. Please try again." : ""
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsInvalid(false);
                }}
                onKeyDown={handleKeyDown}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                onPress={handleConfirm}
                isLoading={isLoading}
                isDisabled={!password.trim()}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
