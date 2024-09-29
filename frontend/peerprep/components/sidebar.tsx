"use client";
import { useTheme } from "next-themes";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import BoxIcon from "./boxicons";
import { Button, Divider } from "@nextui-org/react";
import { siteConfig } from "@/config/site";

export const Sidebar = () => {
  const { theme } = useTheme();

  return (
    <div className="h-fit flex flex-col fixed w-fit pr-4 relative">
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        className="w-fit"
      >
        {siteConfig.navItems
          .map((item) => (
            <ListboxItem
              key={item.label}
              startContent={
                <BoxIcon
                  name={item.icon}
                  color={theme === "dark" ? "#d1d5db" : "#4b5563"}
                />
              }
              className="py-3 my-1"
              href={item.href}
            >
              <span className="text-base text-gray-600 dark:text-gray-300">
                {item.label}
              </span>
            </ListboxItem>
          ))
          .concat(
            <ListboxItem
              key="Question Management"
              startContent={
                <BoxIcon name="bxs-message-square-edit" color="primary" />
              }
              className="py-3 my-1 text-primary"
              href="/"
              color="primary"
            >
              <span className="text-base">Question Management</span>
            </ListboxItem>
          )}
      </Listbox>
      <Button
        className="fixed bottom-5 left-10 flex items-center justify-center bg-transparent text-danger"
        startContent={<BoxIcon name="bx-log-out" color="danger" />}
      >
        Sign out
      </Button>
    </div>
  );
};
