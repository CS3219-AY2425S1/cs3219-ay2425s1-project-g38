"use client";
import { useTheme } from "next-themes";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/react";

import BoxIcon from "./boxicons";

import { siteConfig } from "@/config/site";

export const Sidebar = () => {
  const { theme } = useTheme();

  return (
    <div className="h-fit flex flex-col fixed w-fit pr-4 relative">
      <Listbox
        aria-label="Listbox menu with sections"
        className="w-fit"
        variant="flat"
      >
        {siteConfig.navItems
          .map((item: any) => (
            <ListboxItem
              key={item.label}
              className="py-3 my-1"
              href={item.href}
              startContent={
                <BoxIcon
                  color={theme === "dark" ? "#d1d5db" : "#4b5563"}
                  name={item.icon}
                />
              }
            >
              <span className="text-base text-gray-600 dark:text-gray-300">
                {item.label}
              </span>
            </ListboxItem>
          ))
          .concat(
            <ListboxItem
              key="Question Management"
              className="py-3 my-1 text-primary"
              color="primary"
              href="/"
              startContent={
                <BoxIcon color="primary" name="bxs-message-square-edit" />
              }
            >
              <span className="text-base">Question Management</span>
            </ListboxItem>,
          )}
      </Listbox>
      <Button
        className="fixed bottom-5 left-10 flex items-center justify-center bg-transparent text-danger"
        startContent={<BoxIcon color="danger" name="bx-log-out" />}
      >
        Sign out
      </Button>
    </div>
  );
};
