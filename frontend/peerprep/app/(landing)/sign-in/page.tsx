"use client";

import BoxIcon from "@/components/boxicons";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import PeerprepLogo from "@/components/peerpreplogo";
import { fontFun, fontLogo } from "@/config/fonts";
import { loginUser } from "@/services/userService";
import Toast from "@/components/toast"; // Import Toast component
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection

export default function SignInPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleContinue = async () => {
    const response = await loginUser(id, password);
    const data = await response.json();

    if (response.ok) {
      setToast({ message: "Login successful!", type: "success" });
      setId("");
      setPassword("");
      localStorage.setItem("accessToken", data.data.accessToken);
      setTimeout(() => router.push("/home"), 1000);
    } else {
      setToast({ message: data.message || "Login failed", type: "error" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="flex items-start justify-center mt-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as "success" | "error"}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className="flex flex-col gap-10 w-[450px] bg-slate-200/25 dark:bg-gradient-to-tl from-fuchsia-900/50 to-violet-900/80 p-8 rounded-lg backdrop-blur-sm shadow-lg"
        onKeyDown={handleKeyDown} // Add onKeyDown event to capture Enter key press
        tabIndex={0} // Make div focusable for onKeyDown to work
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center gap-1">
            <PeerprepLogo />
            <div
              className={`${fontLogo.variable} text-[#6A0CE2] dark:text-white py-3`}
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: "48px",
                letterSpacing: "-7px",
              }}
            >
              PeerPrep
            </div>
          </div>
          <h1
            className={`${fontFun.variable} text-3xl`}
            style={{ fontFamily: "var(--font-fun)" }}
          >
            Welcome back!
          </h1>
          <span className="text-xs">
            Don't have an account?{" "}
            <a href="/sign-up" className="underline text-primary">
              Sign-up
            </a>
          </span>
        </div>

        <div className="flex flex-col gap-5 w-fill">
          <Input
            value={id}
            labelPlacement="outside"
            placeholder="Enter your username or email"
            label="Username or email"
            variant="faded"
            radius="sm"
            size="md"
            className="w-md"
            onValueChange={setId}
          />
          <Input
            value={password}
            onValueChange={setPassword}
            labelPlacement="outside"
            label="Password"
            variant="faded"
            radius="sm"
            size="md"
            placeholder="Enter your password"
            classNames={{
              description: "text-gray-700 dark:text-gray-200",
            }}
            className="text-start"
            endContent={
              <Button
                isIconOnly
                variant="light"
                radius="sm"
                size="sm"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
              </Button>
            }
            type={isVisible ? "text" : "password"}
          />
        </div>

        <button
          className="transition ease-in-out bg-violet-600 dark:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-100 dark:active:bg-gray-900 active:bg-violet-700 duration-300 rounded-md p-1.5 text-sm text-gray-200 mb-8"
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
      </div>
    </div>
  );
}
