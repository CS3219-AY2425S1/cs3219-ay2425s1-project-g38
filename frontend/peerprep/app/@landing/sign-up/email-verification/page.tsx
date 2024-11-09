"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/react";

import BoxIcon from "@/components/boxicons";
import Toast from "@/components/toast"; // Import the Toast component
import { fontFun } from "@/config/fonts";
import { verifyCode, getTimeToExpire, resendCode } from "@/auth/actions";
import { delay } from "@/utils/utils";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for button
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [disableInput, setDisableInput] = useState<boolean>(false); // Track if input is disabled
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  useEffect(() => {
    let expirationTime: number | null = null;

    const initializeExpirationTime = async () => {
      try {
        const expirationString = await getTimeToExpire();

        expirationTime = expirationString
          ? new Date(expirationString).getTime()
          : Date.now() + 3 * 60 * 1000; // Default to 3 minutes
      } catch (error) {
        console.error("Failed to fetch expiration time:", error);
        expirationTime = Date.now() + 3 * 60 * 1000;
      }
    };

    const updateCountdown = () => {
      const timer = setInterval(() => {
        if (expirationTime) {
          const timeRemaining = Math.floor(
            (expirationTime - Date.now()) / 1000,
          );

          if (timeRemaining <= 0) {
            clearInterval(timer);
            handleExpiration();
          } else {
            setTimeLeft(timeRemaining);
          }
        }
      }, 1000);

      return () => clearInterval(timer); // Clean up interval on unmount
    };

    const handleExpiration = async () => {
      setToast({
        message: "Code has expired please sign-up again",
        type: "warning",
      });
      setTimeout(() => location.reload(), 1500);
    };

    initializeExpirationTime().then(updateCountdown);
  }, [email, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleContinue = async () => {
    setIsLoading(true);
    await delay(200);

    const response = await verifyCode(Number(code));

    if (response.status === "success") {
      setToast({
        message: "You have registered successfully!",
        type: "success",
      });
      router.push("/");
    } else {
      setIsLoading(false);
      setToast({
        message: response.message,
        type: "error",
      });
    }
  };

  const handleResend = async () => {
    setDisableInput(true); // Disable the input field
    setIsLoading(true);

    const response = await resendCode();

    setIsLoading(false);

    if (response.status === "success") {
      setToast({
        message: "Verification code resent!",
        type: "success",
      });
      setTimeout(() => location.reload(), 1000);
      setDisableInput(false);
    } else {
      setToast({
        message: response.message,
        type: "error",
      });
      setDisableInput(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as "success" | "error" | "warning"}
          onClose={() => setToast(null)} // Clear toast after it closes
        />
      )}

      <div className="flex flex-col gap-10 w-[450px] bg-slate-200/25 dark:bg-gradient-to-tl from-fuchsia-900/50 to-violet-900/80 p-8 rounded-lg backdrop-blur-sm shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="text-success bg-success bg-opacity-25 p-1 flex items-center rounded-full justify-center w-16 h-16">
            {isLoading ? (
              <CircularProgress size="sm" color="success" />
            ) : (
              <BoxIcon name="bxs-envelope" size="36px" />
            )}
          </div>
          <h1
            className={`${fontFun.variable} text-3xl`}
            style={{ fontFamily: "var(--font-fun)" }}
          >
            Please verify your email
          </h1>
          <span className="text-xs">
            Already have an account?{" "}
            <a href="/sign-in" className="underline text-primary">
              Sign-in
            </a>
          </span>
        </div>

        <div className="flex flex-col gap-4 w-fill items-center">
          <p>
            You are almost there! We have sent an email with a verification code
            to&nbsp;
            <strong>{email}</strong>
          </p>
          <Input
            maxLength={6}
            value={code}
            onValueChange={setCode}
            errorMessage="There was an error validating your verification"
            variant="underlined"
            color="success"
            radius="sm"
            size="md"
            className="text-center w-1/3 justify-center text-lg"
            classNames={{
              input: [
                "text-center",
                "text-lg",
                "font-semibold",
                "tracking-widest",
              ],
            }}
            onKeyDown={handleKeyDown}
            autoFocus={true}
            isDisabled={disableInput} // Disable the input field if disableInput is true
          />
          <p className="text-xs">
            Your code will expire in {formatTime(timeLeft)}
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <button
            className="transition ease-in-out bg-violet-600 dark:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-100 dark:active:bg-gray-900 active:bg-violet-700 duration-300 rounded-md p-1.5 text-sm text-gray-200"
            onClick={handleContinue}
          >
            <div className="flex flex-row gap-2 items-center justify-center">
              <div
                className={`${fontFun.variable} my-1 font-medium`}
                style={{ fontFamily: "var(--font-fun)" }}
              >
                Continue
              </div>
              <BoxIcon name="bxs-right-arrow" size="10px" color="#e5e7eb" />
            </div>
          </button>
          <span className="text-xs">
            Did not get it?{" "}
            <Button
              className="underline text-xs text-white bg-violet-700/25 hover:bg-violet-500/90"
              onClick={handleResend}
              size="sm"
              variant="flat"
              radius="sm"
              isDisabled={disableInput}
            >
              Resend
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}
