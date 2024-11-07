"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tooltip,
} from "@nextui-org/react";

import BoxIcon from "./boxicons";

import { validatePassword } from "@/utils/utils";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newPassword: string) => void;
}

export function ChangePasswordModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleConfirm = () => {
    setIsFormSubmitted(true);
    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    onConfirm(newPassword);
    handleClose();
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setIsFormSubmitted(false);
    onOpenChange(false);
  };

  const passwordRequirements = (
    <Tooltip
      content={
        <ul className="list-disc pl-2 py-1 text-xs">
          <li>At least 12 characters long</li>
          <li>Contains at least one uppercase letter</li>
          <li>Contains at least one lowercase letter</li>
          <li>Contains at least one digit</li>
          <li>Contains at least one special character (e.g., @$#!%*?&)</li>
        </ul>
      }
      placement="right"
      showArrow
    >
      <div className="flex flex-row gap-0.5 items-center w-fit text-xs">
        <BoxIcon
          name="bx-info-circle"
          size="10px"
          className="text-white hover:text-gray-200"
        />
        &nbsp;Password requirements
      </div>
    </Tooltip>
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BoxIcon name="bxs-lock" size="40px" />
                <div className="flex flex-col gap-0 items-center">
                  Change Password
                  {passwordRequirements}
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <Input
                label="New Password"
                placeholder="Enter your new password"
                type={isVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isInvalid={newPassword !== "" && !validatePassword(newPassword)}
                errorMessage={
                  !validatePassword(newPassword) &&
                  "Password does not meet requirements"
                }
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
                  </Button>
                }
              />
              <Input
                label="Confirm Password"
                placeholder="Confirm your new password"
                type={isVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={isFormSubmitted && newPassword !== confirmPassword}
                errorMessage={
                  confirmPassword !== "" && newPassword !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
                  </Button>
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                isDisabled={!newPassword || !confirmPassword}
              >
                Change Password
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
