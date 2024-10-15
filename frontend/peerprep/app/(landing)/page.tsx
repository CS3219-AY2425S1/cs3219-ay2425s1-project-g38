"use client";

import { fontFun } from "@/config/fonts";
import landingPageImage from "../../images/LandingPageImage.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { SignUpButtonWrapped } from "@/components/signupbuttonwrapped";
import { SignInButtonWrapped } from "@/components/signinbuttonwrapped";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import MatchUI from "@/components/matching/MatchUI";
import { Textarea } from "@nextui-org/input";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function Landing() {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState(false);
  const { getToken } = useAuth(); // Retrieve token function
  const template = "BackendJWT";

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  const fetchAndStoreJwt = async () => {
    try {
      const token = await getToken({ template });
      if (token) {
        localStorage.setItem("jwt", token); // Store in localStorage
      }
    } catch (error) {
      console.error("Failed to fetch JWT:", error);
    }
  };

  const handleStartSession = async () => {
    await fetchAndStoreJwt(); // Get and store the JWT
    setIsMatchUIVisible(true); // Show the Match UI
  };

  return (
    <div>
      <SignedOut>
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
      </SignedOut>

      <SignedIn>
        <>
          <div>{isMatchUIVisible && <MatchUI onClose={handleClose} />}</div>
          <div className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold text-center">
              Hey there! Ready for some coding challenges? 🧑‍💻
            </h1>
            <div className="flex justify-center gap-8 w-full mt-8">
              <div className="w-3/4">
                <div className="flex gap-4">
                  <Card className="flex-1">
                    <CardBody>
                      <h3 className="text-lg font-semibold mb-2 p-3">
                        Are you ready?
                      </h3>
                    </CardBody>
                    <CardFooter className="flex justify-end p-5">
                      <Button color="primary" onClick={handleStartSession}>
                        Start a new session
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="w-1/4">
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-2 p-3">Friends</h3>
                    <ul className="space-y-4 min-h-40"></ul>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </>
      </SignedIn>
    </div>
  );
}
