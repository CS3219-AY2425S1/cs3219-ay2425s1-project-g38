"use server";

import { env } from "next-runtime-env";
import { cookies } from "next/headers";

const USER_SERVICE_URL = env("NEXT_PUBLIC_USER_SERVICE_URL");

//const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const formData = {
    username,
    email,
    password,
    isAdmin: false,
  };

  const response = await fetch(`${USER_SERVICE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response;
};

export const loginUser = async (identifier: string, password: string) => {
  const formData = {
    identifier,
    password,
  };
  const response = await fetch(`${USER_SERVICE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (response.ok) {
    const expires = new Date(data.data.tokenExpiry);
    cookies().set("session", data.data.accessToken, { expires, httpOnly: true });
    return true;
  } else {
    throw new Error(data.message || "An unknown error occurred during login"); 
  }
};

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return session;
}
