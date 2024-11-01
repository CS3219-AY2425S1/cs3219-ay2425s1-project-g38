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
    <div className="flex justify-start items-center h-full w-1/3">
      <Card
        className={`inline-block p-1.5 ${cardBgColor} rounded-lg shadow-inner h-auto max-h-[150px]`}
      >
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-lg font-bold mb-0.75">In session:</h3>
          <div className="flex flex-wrap gap-1.5">
            {usersInRoom.map((user, index) => (
              <div
              key={index}
              className="flex items-center justify-center w-8 h-8 bg-purple-600 dark:bg-[#F9F9FC] rounded-full shadow"
            >
              <span className="font-bold text-white text-sm dark:text-[#5633A9]">
                {user.charAt(0).toUpperCase()}
              </span>
            </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
