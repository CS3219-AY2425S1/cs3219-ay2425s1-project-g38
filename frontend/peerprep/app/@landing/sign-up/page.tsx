"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { CircularProgress, Tooltip } from "@nextui-org/react";

import BoxIcon from "@/components/boxicons";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import PeerprepLogo from "@/components/peerpreplogo";
import { fontFun } from "@/config/fonts";
import { signUp } from "@/auth/actions"; // Import new server functions
import Toast from "@/components/toast"; // Import the Toast component
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "@/utils/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );

  // Toggle password visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  // Handle "Continue" button press
  const handleContinue = async () => {
    setIsLoading(true);
    setIsFormSubmitted(true);

    if (
      validateEmail(email) &&
      validateUsername(username) &&
      validatePassword(password)
    ) {
      const signUpFormData = new FormData();

      signUpFormData.append("email", email);
      signUpFormData.append("username", username);
      signUpFormData.append("password", password);

      const signUpResponse = await signUp(signUpFormData);

      if (signUpResponse.status === "success") {
        setToast({
          message: "Success! You are almost there!",
          type: "success",
        });
        setTimeout(
          () =>
            router.push(
              `sign-up/email-verification?email=${encodeURIComponent(email)}`,
            ),
          500,
        );
      } else {
        setToast({
          message: signUpResponse.message,
          type: "error",
        });
      }
    } else {
      setToast({
        message: "Invalid form data. Please check your inputs.",
        type: "warning",
      });
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
      <div className="flex flex-row gap-1 items-center w-fit">
        <BoxIcon
          name="bx-info-circle"
          size="12px"
          className="text-white hover:text-gray-200"
        />
        &nbsp;Password requirements
      </div>
    </Tooltip>
  );

  const errorPasswordRequirements = (
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
      <div className="flex flex-row gap-1 items-center w-fit">
        <BoxIcon
          name="bx-info-circle"
          size="12px"
          className="text-danger hover:text-red-700"
        />
        &nbsp;Password does not meet requirements
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
            Create an account
          </h1>
          <span className="text-xs">
            Already have an account?{" "}
            <a href="/sign-in" className="underline text-primary">
              Sign-in
            </a>
          </span>
        </div>

        <div className="flex flex-col gap-2 w-fill">
          <Input
            labelPlacement="outside"
            placeholder="Enter your username"
            label="Username"
            value={username}
            onValueChange={setUsername}
            isInvalid={isFormSubmitted && !validateUsername(username)}
            errorMessage="Username must be 2-32 characters, alphanumeric with _ or -"
            variant="faded"
            radius="sm"
            size="md"
            className="text-start"
            onKeyDown={handleKeyDown}
            isDisabled={isLoading} // Disable input when loading
          />
          <Input
            labelPlacement="outside"
            placeholder="Enter your email"
            label="Email"
            value={email}
            onValueChange={setEmail}
            isInvalid={isFormSubmitted && !validateEmail(email)}
            errorMessage="Please enter a valid email format"
            variant="faded"
            radius="sm"
            size="md"
            className="text-start"
            onKeyDown={handleKeyDown}
            isDisabled={isLoading} // Disable input when loading
          />
          <Input
            labelPlacement="outside"
            label="Password"
            placeholder="Enter your password"
            description={passwordRequirements}
            value={password}
            onValueChange={setPassword}
            isInvalid={!validatePassword(password)}
            errorMessage={errorPasswordRequirements}
            classNames={{
              description: "text-gray-700 dark:text-gray-200",
            }}
            variant="faded"
            radius="sm"
            size="md"
            className="text-start"
            endContent={
              <Button
                isIconOnly
                variant="light"
                radius="sm"
                size="sm"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
                isDisabled={isLoading} // Disable button when loading
              >
                {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
              </Button>
            }
            type={isVisible ? "text" : "password"}
            onKeyDown={handleKeyDown}
            isDisabled={isLoading} // Disable input when loading
          />
        </div>

        <button
          className="transition ease-in-out bg-violet-600 dark:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-100 dark:active:bg-gray-900 active:bg-violet-700 duration-300 rounded-md p-1.5 text-sm text-gray-200 mb-8"
          onClick={handleContinue}
          disabled={isLoading} // Disable button when loading
        >
          <div className="flex flex-row gap-2 items-center justify-center">
            <div
              className={`${fontFun.variable} my-1 font-medium`}
              style={{ fontFamily: "var(--font-fun)" }}
            >
              Continue
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
