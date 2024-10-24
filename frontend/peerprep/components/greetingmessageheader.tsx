"use client";

import { fontFun } from "@/config/fonts";
import { usePathname } from "next/navigation";

interface GreetingMessageProps {
  user: string;
}

export const GreetingMessageHeader = ({ user }: GreetingMessageProps) => {
  const currentPath = usePathname();

  // Determine the greeting message based on the path
  if (currentPath === "/") {
    return (
      <div
        className={`${fontFun.variable} text-black dark:text-white flex items-center w-full text-nowrap`}
        style={{
          fontFamily: "var(--font-fun)",
          fontSize: "20px",
          margin: "10px",
        }}
      >
        <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold">
          {user}
        </p>
        ! Ready for some coding challenges? 🧑‍💻
      </div>
    );
  }

  if (currentPath === "/questions-management") {
    return (
      <div
        className={`${fontFun.variable} text-black dark:text-white flex items-center`}
        style={{
          fontFamily: "var(--font-fun)",
          fontSize: "20px",
          margin: "10px",
        }}
      >
        Hello&nbsp;
        <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold">
          {user}
        </p>
        &nbsp;👋🏻,
      </div>
    );
  }

  // Default message
  return (
    <div>
      <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold">
        {user}
      </p>
    </div>
  );
};
