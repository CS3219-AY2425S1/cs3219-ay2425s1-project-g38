import { env } from "next-runtime-env";

import { getAccessToken } from "../auth/actions";
const NEXT_PUBLIC_COLLAB_SERVICE_URL = env("NEXT_PUBLIC_COLLAB_SERVICE_URL");

export const checkUserMatchStatus = async () => {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_COLLAB_SERVICE_URL}/api/session/check`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      },
    );

    if (response.status === 200) {
      return true;
    }
    if (response.status === 204) {
      return false;
    }
    console.error(`Unexpected status code: ${response.status}`);

    return false;
  } catch (error) {
    throw error;
  }
};

export const leaveMatch = async () => {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_COLLAB_SERVICE_URL}/api/session/leave`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      },
    );

    if (response.status === 200) {
      return;
    }

    throw new Error("Unexpected status code");
  } catch (error) {
    throw error;
  }
};

export const getSessionDetails = async (sessionId: string) => {
  console.log(`${NEXT_PUBLIC_COLLAB_SERVICE_URL}/api/session/details`);
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_COLLAB_SERVICE_URL}/api/session/details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({ sessionId: sessionId }),
      }
    );

    console.log(response);

    if (response.ok) {
      console.log("success");
      const data = await response.json();
      return { status: "success", data };
    } else {
      const errorData = await response.json();
      return {
        status: "error",
        message: errorData.message || "Failed to retrieve session details.",
      };
    }
  } catch (error) {
    console.log("Error fetching session details:", error);
    return {
      status: "error",
      message: "Unable to reach the session service. Please try again later.",
    };
  }
};
