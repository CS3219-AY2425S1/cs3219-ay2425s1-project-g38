"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface UsersInRoomProps {
  usersInRoom: string[];
  setUsersInRoom: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UsersInRoom = ({ usersInRoom }: UsersInRoomProps) => {
  const { resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

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
