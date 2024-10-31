"use server";

import { TextEncoder } from "util";

import { getIronSession } from "iron-session";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import {
  sessionOptions,
  SessionData,
  defaultSession,
  CreateUserSessionData,
  createUserOptions,
} from "./lib";

const USER_SERVICE_URL = env("NEXT_PUBLIC_USER_SERVICE_URL");

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  if (!session.isAdmin) {
    session.isAdmin = defaultSession.isAdmin;
  }

  return session;
};

export const getCreateUserSession = async () => {
  const session = await getIronSession<CreateUserSessionData>(
    cookies(),
    createUserOptions,
  );

  if (!session.isPending) {
    session.isPending = false;
  }

  return session;
};

export const getAccessToken = async () => {
  const session = await getSession();

  return session.accessToken;
};

export const getEmailToken = async () => {
  const session = await getCreateUserSession();

  return session.emailToken;
};

export const getUsername = async () => {
  const session = await getSession();

  return session.username;
};

export const isSessionLoggedIn = async () => {
  const session = await getSession();

  return session.isLoggedIn;
};

export const isSessionAdmin = async () => {
  const session = await getSession();

  console.log("isSessionAdmin: ", session.isAdmin);
  if (!session.isAdmin) {
    return false;
  } else {
    return session.isAdmin;
  }
};

export const getTimeToExpire = async () => {
  const session = await getCreateUserSession();

  return session.ttl;
};

export const login = async (formData: FormData) => {
  const session = await getSession();

  const formIdentifier = formData.get("identifier") as string;
  const formPassword = formData.get("password") as string;

  try {
    // Make the login request to your API
    const response = await fetch(`${USER_SERVICE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: formIdentifier,
        password: formPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Set session data
      session.userId = data.data.id; // Get user ID from the response
      session.username = data.data.username; // Get username from the response
      session.isLoggedIn = true;
      session.accessToken = data.data.accessToken; // Store the access token in the session
      session.isAdmin = data.data.isAdmin; // Check if the user is an admin

      await session.save();

      return { status: "success", message: "Login successful." }; // Return success status
    } else {
      // Handle error response (e.g., show error message)
      const errorData = await response.json();

      return { status: "error", message: errorData.message || "Login failed." }; // Return error status
    }
  } catch (error) {
    console.error("Login error:", error);

    return {
      status: "error",
      message: "Unable to reach the user service. Please try again later.",
    };
  }
};

export const logout = async () => {
  const session = await getSession();

  session.destroy();

  return { status: "success", message: "Logged out successfully." }; // Return success status
};

export const signUp = async (formData: FormData) => {
  const formUsername = formData.get("username") as string;
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;
  const session = await getCreateUserSession();

  try {
    // Make the signup request to your API
    const response = await fetch(`${USER_SERVICE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formUsername,
        email: formEmail,
        password: formPassword,
      }),
    });

    if (response.ok) {
      const res = await response.json();

      session.emailToken = res.data.token;
      session.isPending = true;
      session.ttl = res.data.expiry;

      await session.save();

      return { status: "success", message: "User registered successfully." }; // Return success status
    } else {
      // Handle error response (e.g., show error message)
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Sign up failed.",
      }; // Return error status
    }
  } catch (error) {
    console.error("Sign up error:", error);

    return {
      status: "error",
      message: "Unable to reach the user service. Please try again later.",
    };
  }
};

export const resendCode = async () => {
  const signUpSession = await getCreateUserSession();

  try {
    const emailToken = await getEmailToken();
    const secret = env("JWT_SECRET");

    if (!emailToken || !secret) {
      return {
        status: "error",
        message:
          "Token has expired or does not exist, or an internal error occurred.",
      };
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(emailToken, secretKey);

    const response = await fetch(
      `${USER_SERVICE_URL}/users/${payload.id}/resend-request`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${emailToken}` },
      },
    );

    if (response.ok) {
      const res = await response.json();

      signUpSession.emailToken = res.data.token;
      signUpSession.isPending = true;
      signUpSession.ttl = res.data.expiry;

      // Renew maxAge by updating the session config and saving it
      signUpSession.updateConfig(createUserOptions);
      await signUpSession.save();

      return { status: "success", message: "Code resent successfully" };
    } else {
      console.error("Code resend fail");
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Code resend failed",
      };
    }
  } catch (err) {
    console.error("Code resend error:", err);

    return { status: "error", message: "An unexpected error occurred." };
  }
};

export const verifyCode = async (code: number) => {
  const session = await getSession();
  const signUpSession = await getCreateUserSession();

  try {
    const emailToken = await getEmailToken();
    const secret = env("JWT_SECRET");

    if (!emailToken) {
      return {
        status: "error",
        message: "Token has expired or does not exist",
      };
    }

    if (!secret) {
      return { status: "error", message: "Internal application error" };
    }

    // Convert the secret string to Uint8Array
    const secretKey = new TextEncoder().encode(secret);

    // Decode the JWT token
    const { payload } = await jwtVerify(emailToken, secretKey);

    // Extract the verification code from the token's payload
    const verificationCode = payload.code;

    if (!verificationCode) {
      return {
        status: "error",
        message: "Verification code not found in token.",
      };
    }

    if (verificationCode === code) {
      const response = await fetch(`${USER_SERVICE_URL}/auth/${payload.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${emailToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        await signUpSession.destroy();

        // Set session data
        session.userId = data.data.id; // Get user ID from the response
        session.username = data.data.username; // Get username from the response
        session.isLoggedIn = true;
        session.accessToken = data.data.accessToken; // Store the access token in the session
        session.isAdmin = data.data.isAdmin; // Check if the user is an admin

        await session.save();

        return {
          status: "success",
          message: "Code verified successfully, user registered successfully!",
        };
      } else {
        const errorData = await response.json();
        return {
          status: "error",
          message: errorData.message || "There was a problem registering the user.",
        };
      }
    } else {
      console.log(verificationCode, code);
      return {
        status: "error",
        message: "Verification code is wrong! Please check and try again!",
      };
    }
  } catch (error) {
    console.error("Error verifying token:", error);

    return {
      status: "error",
      message: "There was an error validating your code.",
    };
  }
};

export const deleteNewUserRequest = async (email: string) => {
  if (!email) {
    return { status: "error", message: "No email provided" };
  }

  const response = await fetch(`${USER_SERVICE_URL}/users/${email}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return {
      status: "warning",
      message: "Verification code has expired please sign-up again!",
    };
  } else {
    return {
      status: "error",
      message:
        "There was a fatal error, please sign-up with a different email and username!",
    };
  }
};
