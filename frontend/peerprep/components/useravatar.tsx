"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useIsSSR } from "@react-aria/ssr";
import { useState } from "react";
import BoxIcon from "./boxicons";
import { SignOutConfirmationModal } from "./signoutconfirmationmodal";
import { logout } from "@/auth/actions";

interface UserAvatarProps {
  userName?: string;
  userEmail?: string;
}

export const UserAvatar = ({ userName, userEmail }: UserAvatarProps) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const isSSR = useIsSSR();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    setTimeout(async () => await logout(), 1000);
  };

  const handleSignOutClick = () => {
    setModalOpen(true);
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme.toLowerCase());
  };

  return (
    <>
      <Dropdown
        radius="sm"
        classNames={{
          base: "before:bg-default-200",
          content: "p-0 border-small border-divider bg-background",
        }}
      >
        <DropdownTrigger>
          <Avatar
            as="button"
            icon={
              <BoxIcon name="bxs-user" size="16px" className="shadow-2xl" />
            }
            size="sm"
            classNames={{
              base: "bg-gradient-to-br from-violet-500/50 to-fuchsia-500",
            }}
            className="transition ease-in-out hover:scale-110 ml-4 text-white dark:text-black"
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User menu"
          className="p-3"
          itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          <DropdownSection aria-label="Profile & Actions" showDivider>
            <DropdownItem
              isReadOnly
              key="profile"
              className="h-14 gap-2 opacity-100"
            >
              <User
                name={userName}
                description={userEmail}
                classNames={{
                  name: "text-default-600",
                  description: "text-default-500",
                }}
                avatarProps={{
                  size: "sm",
                  icon: <BoxIcon name="bxs-user" size="16px" />,
                  className:
                    "bg-gradient-to-br from-violet-500/50 to-fuchsia-500 text-white dark:text-black",
                }}
              />
            </DropdownItem>
            <DropdownItem key="dashboard" onClick={() => router.push("/")}>
              <div className="flex items-center gap-2">
                <BoxIcon name="bxs-dashboard" size="16px" />
                Dashboard
              </div>
            </DropdownItem>
            <DropdownItem
              key="settings"
              onClick={() => router.push("/settings")}
            >
              <div className="flex items-center gap-2">
                <BoxIcon name="bxs-cog" size="16px" />
                Settings
              </div>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection aria-label="Preferences" showDivider>
            <DropdownItem
              isReadOnly
              key="theme"
              className="cursor-default"
              endContent={
                <select
                  className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                  id="theme"
                  name="theme"
                  value={
                    theme === "system"
                      ? "System"
                      : theme === "dark"
                        ? "Dark"
                        : "Light"
                  }
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  <option>System</option>
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              }
            >
              <div className="flex items-center gap-2">
                <BoxIcon
                  name={
                    theme === "dark" || (theme === "system" && !isSSR)
                      ? "bxs-moon"
                      : "bxs-sun"
                  }
                  size="16px"
                />
                Theme
              </div>
            </DropdownItem>
          </DropdownSection>
          <DropdownSection aria-label="Help & Feedback">
            <DropdownItem key="logout" onClick={handleSignOutClick}>
              <div className="flex items-center gap-2 text-danger">
                <BoxIcon name="bx-log-out" size="16px" />
                Sign out
              </div>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <SignOutConfirmationModal
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleLogout}
      />
    </>
  );
};
