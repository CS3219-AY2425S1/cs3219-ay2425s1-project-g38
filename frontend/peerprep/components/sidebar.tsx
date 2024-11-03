"use client";

import { useTheme } from "next-themes";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import BoxIcon from "./boxicons";
import { SignOutConfirmationModal } from "./signoutconfirmationmodal"; // Import the modal

import { siteConfig } from "@/config/site";
import { logout } from "@/auth/actions";

interface SidebarProps {
  isAdmin: boolean;
}

export const Sidebar = ({ isAdmin }: SidebarProps) => {
  const { theme } = useTheme();
  const currentPath = usePathname();
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState(false); // Track modal open state

  const handleLogout = async () => {
    setTimeout(async () => await logout(), 1000);
    router.push("/");
  };

  const handleSignOutClick = () => {
    setModalOpen(true); // Open the modal when sign out button is clicked
  };

  return (
    <div className="h-fit flex flex-col fixed pt-4 relative w-1/5 max-w-52 min-w-36 mr-6">
      <SignOutConfirmationModal
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleLogout} // Perform logout on confirmation
      />

      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        className="w-full"
      >
        {siteConfig.navItems
          .concat(isAdmin ? siteConfig.adminNavItems : [])
          .map((item: any) => (
            <ListboxItem
              key={item.label}
              startContent={
                <BoxIcon
                  name={item.icon}
                  color={
                    item.href === "/" && currentPath === "/"
                      ? "#7828C8"
                      : currentPath.startsWith(item.href) && item.href !== "/"
                        ? "#7828C8"
                        : theme === "dark"
                          ? "#d1d5db"
                          : "#4b5563"
                  }
                />
              }
              className="py-3 my-1"
              href={item.href}
            >
              <span
                className={
                  item.href === "/" && currentPath === "/"
                    ? "text-secondary"
                    : currentPath.startsWith(item.href) && item.href !== "/"
                      ? "text-secondary"
                      : "text-gray-600 dark:text-gray-300"
                }
              >
                {item.label}
              </span>
            </ListboxItem>
          ))}
      </Listbox>

      <Button
        className="fixed bottom-5 left-10 flex items-center justify-center bg-transparent text-danger"
        startContent={<BoxIcon name="bx-log-out" color="danger" />}
        onClick={handleSignOutClick} // Trigger the modal on button click
      >
        Sign out
      </Button>
    </div>
  );
};
