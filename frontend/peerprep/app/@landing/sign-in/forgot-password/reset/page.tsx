"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress, Tooltip } from "@nextui-org/react";

import BoxIcon from "@/components/boxicons";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import PeerprepLogo from "@/components/peerpreplogo";
import { fontFun } from "@/config/fonts";
import { validatePassword } from "@/utils/utils";
import Toast from "@/components/toast";
import { resetPassword } from "@/auth/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleResetPassword();
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setIsFormSubmitted(true);

    if (!validatePassword(password)) {
      setToast({
        message: "Password does not meet requirements",
        type: "error",
      });
      setIsLoading(false);

      return;
    }

    if (password !== confirmPassword) {
      setToast({
        message: "Passwords do not match",
        type: "error",
      });
      setIsLoading(false);

      return;
    }
    try {
      const response = await resetPassword(password);

      if (response.status === "success") {
        setToast({
          message:
            "Password reset successful! Please login with your new password.",
          type: "success",
        });
        setTimeout(() => router.push("/sign-in"), 2000);
      } else {
        setToast({
          message: response.message || "Failed to reset password",
          type: "error",
        });
        router.push("/sign-in");
      }
    } catch (error) {
      setToast({
        message: "An error occurred. Please try again.",
        type: "error",
      });
      router.push("/sign-in");
    }

    setIsLoading(false);
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
      <div className="flex flex-row gap-1 items-center w-fit dark:hover:text-gray-300 hover:text-gray-500">
        <BoxIcon name="bx-info-circle" size="12px" />
        &nbsp;Password requirements
      </div>
    </Tooltip>
  );

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
            Reset Your Password
          </h1>
          <span className="text-xs text-center">
            Please enter your new password
          </span>
        </div>

        <div className="flex flex-col gap-4 w-fill">
          {passwordRequirements}
          <Input
            label="New Password"
            variant="faded"
            placeholder="Enter your new password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
              </button>
            }
            type={isVisible ? "text" : "password"}
            value={password}
            onValueChange={setPassword}
            isInvalid={isFormSubmitted && !validatePassword(password)}
            errorMessage={
              isFormSubmitted && !validatePassword(password)
                ? "Password does not meet requirements"
                : ""
            }
            isDisabled={isLoading}
          />

          <Input
            label="Confirm Password"
            variant="faded"
            placeholder="Confirm your new password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmVisibility}
              >
                {isConfirmVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
              </button>
            }
            type={isConfirmVisible ? "text" : "password"}
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isInvalid={isFormSubmitted && password !== confirmPassword}
            errorMessage={
              isFormSubmitted && password !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
            onKeyDown={handleKeyDown}
            isDisabled={isLoading}
          />
        </div>

        <button
          className="transition ease-in-out bg-violet-600 dark:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-100 dark:active:bg-gray-900 active:bg-violet-700 duration-300 rounded-md p-1.5 text-sm text-gray-200"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          <div className="flex flex-row gap-2 items-center justify-center">
            <div
              className={`${fontFun.variable} my-1 font-medium`}
              style={{ fontFamily: "var(--font-fun)" }}
            >
              Reset Password
            </div>
            {isLoading ? (
              <CircularProgress size="sm" color="secondary" />
            ) : (
              <BoxIcon name="bxs-right-arrow" size="10px" color="#e5e7eb" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
