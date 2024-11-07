"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MatchUI from "@/components/matching/MatchUI";
import StartMatchCard from "@/components/startmatchcard";
import { checkUserMatchStatus, leaveMatch } from "@/services/sessionAPI";
import ReconnectCard from "@/components/reconnectcard";
import BoxIcon from "@/components/boxicons";
import SessionHistory from "@/components/session-history/SessionHistory";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export default function Dashboard() {
  const router = useRouter();
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(false);
  const [isUserInMatch, setIsUserInMatch] = useState<boolean>(false);
  const [isCollabServiceUp, setIsSessionServiceUp] = useState<boolean>(true);

  useEffect(() => {
    const checkMatchStatus = async () => {
      try {
        const isInMatch = await checkUserMatchStatus(); // returns true or false

        setIsUserInMatch(isInMatch);
        setIsSessionServiceUp(true); // Indicate session service is up
      } catch (error) {
        console.error("Error checking user match status", error);
        setIsSessionServiceUp(false); // Indicate session service issue
      }
    };

    checkMatchStatus(); // Call the async function
  }, []);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  const handleReconnect = () => {
    // Reconnect to the match
    router.push("/session");
  };

  const handleLeaveMatch = () => {
    try {
      leaveMatch();
      setIsUserInMatch(false);
      setIsSessionServiceUp(true);
    } catch (error) {
      console.error("Error leaving match", error);
    }
  };

  return (
    <>
      <div>{isMatchUIVisible && <MatchUI onClose={handleClose} />}</div>
      <div className="flex flex-col items-center py-8 md:py-6 gap-3">
        <p className="text-md text-left w-full font-semibold">My Activities</p>
        <div className="flex justify-center gap-8 w-full my-4 w-3/4">
          <div className="w-3/4">
            <div className="flex flex-col gap-4">
              {!isCollabServiceUp && (
                <div className="text-danger text-sm bg-danger bg-opacity-10 p-2 flex items-center justify-center rounded-lg ">
                  <BoxIcon name="bx-error pr-2" size="24px" />
                  Collaboration Service is currently unavailable. Please try
                  again later.
                </div>
              )}
              {isUserInMatch ? (
                <ReconnectCard
                  onReconnect={handleReconnect}
                  onLeave={handleLeaveMatch}
                />
              ) : (
                <StartMatchCard
                  onStart={() => setIsMatchUIVisible(true)}
                  isCollabAvail={isCollabServiceUp}
                />
              )}
            </div>
          </div>
          <div className="w-1/4 hidden md:flex" />
        </div>
        <p className="text-md text-left w-full font-semibold">Activity Feed</p>
        <div className="flex justify-center gap-8 w-full mt-4 w-3/4">
          <div className="w-3/4">
            <div className="flex flex-col gap-4">
              <SessionHistory />
            </div>
          </div>
          <div className="w-1/4 hidden md:flex" />
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
}
