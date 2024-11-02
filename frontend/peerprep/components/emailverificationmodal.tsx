"use client";

import React, { useEffect, useRef, useState } from "react";
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
import {
  getEmailChangeTimeToExpire,
  clearEmailChangeSession,
} from "@/auth/actions";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (code: number, email: string) => void;
  email: string;
}

export function EmailVerificationModal({
  isOpen,
  onOpenChange,
  onVerify,
  email,
}: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const handleClose = async () => {
    setVerificationCode("");
    setTimeLeft(0);
    setIsExpired(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    await clearEmailChangeSession();
    onOpenChange(false);
  };

  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen]);

  useEffect(() => {
    let expirationTime: number | null = null;

    const initializeExpirationTime = async () => {
      try {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        const expirationString = await getEmailChangeTimeToExpire();
        expirationTime = expirationString
          ? new Date(expirationString).getTime()
          : Date.now() + 3 * 60 * 1000;
      } catch (error) {
        console.error("Failed to fetch expiration time:", error);
        expirationTime = Date.now() + 3 * 60 * 1000;
      }
    };

    const updateCountdown = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        if (expirationTime) {
          const timeRemaining = Math.floor(
            (expirationTime - Date.now()) / 1000
          );

          if (timeRemaining <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setIsExpired(true);
            handleClose();
          } else {
            setTimeLeft(timeRemaining);
            setIsExpired(false);
          }
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    };

    if (isOpen) {
      initializeExpirationTime().then(updateCountdown);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleVerify = () => {
    const code = parseInt(verificationCode);
    if (!isNaN(code)) {
      onVerify(code, email);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          onOpenChange(open);
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BoxIcon name="bxs-envelope" />
                Check your email
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">
                We sent a verification code to <strong>{email}</strong>
              </p>
              <Input
                maxLength={6}
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                classNames={{
                  input: [
                    "text-center",
                    "text-lg",
                    "font-semibold",
                    "tracking-widest",
                  ],
                }}
              />
              {timeLeft > 0 && (
                <p className="text-sm text-gray-500">
                  Code expires in: {formatTime(timeLeft)}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleVerify}
                isDisabled={isExpired}
              >
                Verify
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
