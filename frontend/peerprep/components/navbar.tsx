import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";

import { GreetingMessageHeader } from "./greetingmessageheader";

import { ThemeSwitch } from "@/components/theme-switch";
import { SettingButton, NotificationButton } from "@/components/navbar-buttons";
import { Logo } from "@/components/icons";
import { Avatar } from "@nextui-org/react";
import { UserAvatar } from "./useravatar";
import { getEmail, getUsername } from "@/auth/actions";

type NavbarProps = {
  user: string;
};

export const Navbar = async ({ user }: NavbarProps) => {
  const username = await getUsername();
  const email = await getEmail();

  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-4/5 sm:basis-full gap-10" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        <GreetingMessageHeader user={user} />
      </NavbarContent>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-center">
          <div className="hidden sm:flex flex-row items-center justify-center">
            <NotificationButton />
            <ThemeSwitch className="ml-2.5" />
            <UserAvatar userName={username} userEmail={email} />
          </div>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
