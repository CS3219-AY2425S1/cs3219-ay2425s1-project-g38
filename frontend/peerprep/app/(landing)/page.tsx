"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

import landingPageImage from "../../images/LandingPageImage.png";

import { fontFun } from "@/config/fonts";
import { SignUpButtonWrapped } from "@/components/signupbuttonwrapped";
import { SignInButtonWrapped } from "@/components/signinbuttonwrapped";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Landing() {
  return (
    <div>
      <Navbar position="sticky" maxWidth="full" shouldHideOnScroll>
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="flex items-center justify-center hidden sm:flex">
            <ThemeSwitch className="items-center" />
          </NavbarItem>
          <NavbarItem>
            <SignInButtonWrapped />
          </NavbarItem>
          <NavbarItem>
            <SignUpButtonWrapped label="Sign-up" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex flex-col min-h-screen py-5">
        <main className="flex flex-col h-screen lg:flex-row items-center justify-between p-5">
          <div className="mb-52 text-center lg:text-left lg:w-1/2">
            <h1
              className={`${fontFun.variable} text-5xl py-5`}
              style={{ fontFamily: "var(--font-fun)" }}
            >
              Two is better than one
            </h1>
            <p
              className={`${fontFun.variable} text-md mb-6`}
              style={{ fontFamily: "var(--font-fun)" }}
            >
              Level Up Your Interview Skills With PeerPrep! Find peers, solve
              coding challenges, <br />
              and prepare for technical interviews.
            </p>
            <div className="flex justify-center lg:justify-start space-x-4">
              <SignUpButtonWrapped label="Sign-up now!" />
              <SignInButtonWrapped />
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-end">
            <img
              src={landingPageImage.src}
              alt="Illustration"
              className="w-9/12"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
