"use client";

import { useTheme } from "next-themes";
import { Card } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { socket } from "../../services/sessionService";

interface UsersInRoomProps {
  usersInRoom: string[];
  setUsersInRoom: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UsersInRoom = ({
  usersInRoom,
  setUsersInRoom,
}: UsersInRoomProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

  const cardBgColor =
    usersInRoom.length >= 2
      ? theme === "dark"
        ? "bg-gradient-to-br from-[#2055A6] to-[#6F0AD4]"
        : "bg-white border-2 border-purple-500"
      : theme === "dark"
        ? "bg-gray-700"
        : "bg-gray-200 border-purple-600";

  if (!isThemeReady) {
    return null; // or a loading spinner, or any placeholder
  }

  return (
    <div className="flex justify-start items-center h-full w-3/4">
      <div className="flex flex-row items-center gap-2">
        <div className="flex gap-1.5">
          {usersInRoom.map((user, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center w-8 h-8 bg-purple-600 dark:bg-[#F9F9FC] rounded-full shadow group"
            >
              <span className="font-bold text-white text-sm dark:text-[#5633A9]">
                {user.charAt(0).toUpperCase()}
              </span>
              {/* Tooltip positioned below */}
              <div className="absolute top-full mt-1 hidden w-max p-1 text-xs text-white bg-black rounded-md shadow-lg group-hover:block z-10">
                {user}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
