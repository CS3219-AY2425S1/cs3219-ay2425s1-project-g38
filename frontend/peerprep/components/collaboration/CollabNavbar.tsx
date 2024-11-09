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
import { Logo } from "@/components/icons";
import { chatMessage } from "@/utils/utils";

export interface CollabNavbarProps {
  usersInRoom: string[];
  username: string;
  setUsersInRoom: React.Dispatch<React.SetStateAction<string[]>>;
  isModalVisible: boolean;
  userConfirmed: boolean;
  isCancelled: boolean;
  isFirstToCancel: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConfirm: () => void;
  setIsCancelled: (isCancelled: boolean) => void;
  propagateMessage: (message: chatMessage) => void;
  chatHistory: chatMessage[];
}

export const CollabNavbar = ({
  usersInRoom,
  username,
  setUsersInRoom,
  isModalVisible,
  userConfirmed,
  isCancelled,
  isFirstToCancel,
  handleOpenModal,
  handleCloseModal,
  handleConfirm,
  setIsCancelled,
  propagateMessage,
  chatHistory,
}: CollabNavbarProps) => {
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
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-end gap-3">
          <div className="flex items-center justify-end gap-3 p-5">
            <UsersInRoom
              usersInRoom={usersInRoom}
              setUsersInRoom={setUsersInRoom}
            />
          </div>
        </NavbarItem>
        <NavbarItem className="flex items-center justify-end gap-3">
          <TerminateModal
            isModalVisible={isModalVisible}
            userConfirmed={userConfirmed}
            isCancelled={isCancelled}
            isFirstToCancel={isFirstToCancel}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            handleConfirm={handleConfirm}
            setIsCancelled={setIsCancelled}
          />
        </NavbarItem>
        <NavbarItem className="flex items-center justify-center gap-5">
          <div className="hidden sm:flex">
            <ThemeSwitch className="ml-2.5" />
          </div>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
