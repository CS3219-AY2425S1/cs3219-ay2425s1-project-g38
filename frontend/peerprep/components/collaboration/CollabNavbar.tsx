import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";

import { UsersInRoom } from "./UsersInRoom";
import TerminateModal from "./TerminateModal";

import { ThemeSwitch } from "@/components/theme-switch";
import { SettingButton, NotificationButton } from "@/components/navbar-buttons";
import { Logo } from "@/components/icons";
import { getUsername } from "@/auth/actions";

export const CollabNavbar = () => {
  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-4/5 sm:basis-full gap-10" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        {/* <GreetingMessageHeader user={user || "User"} /> */}
      </NavbarContent>
      <NavbarContent className="basis-full" justify="center">
        <UsersInRoom /> {/* Add the UsersInRoom component */}
      </NavbarContent>
      <NavbarContent className="basis-1/5" justify="center">
        <TerminateModal /> {/* Add the UsersInRoom component */}
      </NavbarContent>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-center gap-5">
          <div className="hidden sm:flex">
            <SettingButton />
            <NotificationButton />
            <ThemeSwitch className="ml-2.5" />
          </div>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
