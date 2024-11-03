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
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long");

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    onConfirm(newPassword);
    handleClose();
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BoxIcon name="bxs-lock" />
                Change Password
              </div>
            </ModalHeader>
            <ModalBody>
              <Input
                label="New Password"
                placeholder="Enter your new password"
                type={isVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                errorMessage={
                  !validatePassword(newPassword) &&
                  "Password must be at least 8 characters"
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
                errorMessage={
                  confirmPassword && newPassword !== confirmPassword
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
              {error && <p className="text-danger text-sm">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                isDisabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
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
