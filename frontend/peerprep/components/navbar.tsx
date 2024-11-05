import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";

import { GreetingMessageHeader } from "./greetingmessageheader";
import { UserAvatar } from "./useravatar";

import { ThemeSwitch } from "@/components/theme-switch";
import { NotificationButton } from "@/components/navbar-buttons";
import { Logo } from "@/components/icons";

type NavbarProps = {
  username: string;
  email: string;
};

export const Navbar = ({ username, email }: NavbarProps) => {
  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-4/5 sm:basis-full gap-10" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        <GreetingMessageHeader user={username} />
      </NavbarContent>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-center">
          <div className="hidden sm:flex flex-row items-center justify-center">
            <ThemeSwitch className="ml-2.5" />
            <UserAvatar userName={username} userEmail={email} />
          </div>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
