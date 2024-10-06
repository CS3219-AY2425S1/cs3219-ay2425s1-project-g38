"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { SettingButton, NotificationButton } from "@/components/navbar-buttons";
import { Logo } from "@/components/icons";
import { fontFun } from "@/config/fonts";

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full gap-10" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        <div
          className={`${fontFun.variable} text-black dark:text-white flex items-center`}
          style={{
            fontFamily: "var(--font-fun)",
            fontSize: "20px",
            margin: "10px",
          }}
        >
          Hello User 👋🏻,
        </div>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-center gap-5">
          <div className="hidden sm:flex">
            <SettingButton />
            <NotificationButton />
            <ThemeSwitch className="ml-2.5" />
          </div>

          <Avatar
            classNames={{
              base: "bg-primary h-6 w-6",
              icon: "text-white/80",
            }}
            icon={<AvatarIcon />}
            size="sm"
          />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
