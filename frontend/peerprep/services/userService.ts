"use server"

import { env } from "next-runtime-env";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

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

export async function loginUser(prevState: any, formData: FormData): Promise<string | void> {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function checkUserExists(identifier: string): Promise<any> {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/users/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // Ensure JSON is sent correctly
        "x-api-key": process.env.NEXT_PUBLIC_USER_BACKEND_API_KEY as string,  // Correctly include API key
      },
      body: JSON.stringify({ identifier }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to check user existence:", error);
    throw error;
  }
}

export const verifyCredentials = async (identifier: string, password: string) => {
  const formData = {
    identifier,
    password,
  };
  const response = await fetch(`${USER_SERVICE_URL}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_USER_BACKEND_API_KEY as string,
    },
    body: JSON.stringify(formData),
  });

  return response;
};

