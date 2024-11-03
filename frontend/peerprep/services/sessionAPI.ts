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
