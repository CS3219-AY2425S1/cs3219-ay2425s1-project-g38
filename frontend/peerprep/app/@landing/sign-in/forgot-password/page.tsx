"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@nextui-org/react";

import BoxIcon from "@/components/boxicons";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import PeerprepLogo from "@/components/peerpreplogo";
import { fontFun } from "@/config/fonts";
import { forgetPassword, signUp } from "@/auth/actions"; // Import new server functions
import Toast from "@/components/toast"; // Import the Toast component
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "@/utils/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  // Handle "Continue" button press
  const handleContinue = async () => {
    setIsLoading(true);
    setIsFormSubmitted(true);

    if (identifier) {
      const response = await forgetPassword(identifier);

      if (response.status === "success") {
        setIsSuccess(true);
        setTimeout(() => router.push("/"), 4000);
      } else if (response.status === "warning") {
        setToast({
          message: response.message,
          type: "warning",
        });
        setTimeout(() => {
          setToast({
            message: "Redirecting you to sign up...",
            type: "warning",
          });
          setTimeout(() => router.push("/sign-up"), 2500);
        }, 3000);
      } else {
        setToast({
          message:
            response.message || "Failed to send reset link. Please try again.",
          type: "error",
        });
      }
    } else {
      setToast({
        message: "Please enter your username or email address",
        type: "warning",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center mt-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as "success" | "error" | "warning"}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col gap-10 w-[450px] bg-slate-200/25 dark:bg-gradient-to-tl from-fuchsia-900/50 to-violet-900/80 p-8 rounded-lg backdrop-blur-sm shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <PeerprepLogo />
          <h1
            className={`${fontFun.variable} text-3xl`}
            style={{ fontFamily: "var(--font-fun)" }}
          >
            {isSuccess ? "Email Sent!" : "Don't worry we got you!"}
          </h1>
          <span className="text-xs text-center">
            {isSuccess
              ? "Please check your email for the password reset link"
              : "Enter your username or email address and we'll send you a link to reset your password"}
          </span>
        </div>

        <div className="flex flex-col gap-2 w-fill">
          <Input
            labelPlacement="outside"
            placeholder="Enter your username or email"
            label="Username or Email"
            value={identifier}
            onValueChange={setIdentifier}
            isInvalid={isFormSubmitted && !identifier}
            errorMessage={
              isFormSubmitted && !identifier ? "This field is required" : ""
            }
            variant="faded"
            radius="sm"
            size="md"
            className="text-start"
            onKeyDown={handleKeyDown}
            isDisabled={isLoading || isSuccess}
          />
        </div>

        <button
          className={`transition ease-in-out ${
            isSuccess
              ? "bg-green-600/50 backdrop-blur cursor-not-allowed"
              : "bg-violet-600 dark:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.02]"
          } active:scale-100 dark:active:bg-gray-900 active:bg-violet-700 duration-300 rounded-md p-1.5 text-sm text-gray-200 mb-8`}
          onClick={handleContinue}
          disabled={isLoading || isSuccess}
        >
          <div className="flex flex-row gap-2 items-center justify-center">
            <div
              className={`${fontFun.variable} my-1 font-medium`}
              style={{ fontFamily: "var(--font-fun)" }}
            >
              {isSuccess ? "Email Sent!" : "Continue"}
            </div>
            {isLoading ? (
              <CircularProgress size="sm" color="secondary" />
            ) : (
              !isSuccess && (
                <BoxIcon name="bxs-right-arrow" size="10px" color="#e5e7eb" />
              )
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
