"use server";

import { TextEncoder } from "util";

import { getIronSession } from "iron-session";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

import {
  sessionOptions,
  SessionData,
  defaultSession,
  CreateUserSessionData,
  createUserOptions,
  EmailChangeSessionData,
  emailChangeOptions,
  ResetPasswordSessionData,
  resetPasswordOptions,
} from "./lib";

const USER_SERVICE_URL = env("NEXT_PUBLIC_USER_SERVICE_URL");

export const getSession = async () => {
  const session = await getIronSession<SessionData>(
    cookies() as any,
    sessionOptions,
  );

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

export const getEmailChangeSession = async () => {
  const session = await getIronSession<EmailChangeSessionData>(
    cookies(),
    emailChangeOptions,
  );

  return session;
};

export const getResetPasswordSession = async () => {
  const session = await getIronSession<ResetPasswordSessionData>(
    cookies(),
    resetPasswordOptions,
  );

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

export const getEmailChangeEmailToken = async () => {
  const session = await getEmailChangeSession();

  return session.emailToken;
};

export const getResetPasswordToken = async () => {
  const session = await getResetPasswordSession();

  return session.resetToken;
};

export const getUsername = async () => {
  const session = await getSession();

  return session.username;
};

export const getEmail = async () => {
  const session = await getSession();

  return session.email;
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

export const getEmailChangeTimeToExpire = async () => {
  const session = await getEmailChangeSession();

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
      session.email = data.data.email;
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

export const verifyPassword = async (enteredPassword: string) => {
  const token = await getAccessToken();

  try {
    const response = await fetch(`${USER_SERVICE_URL}/auth/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: enteredPassword,
      }),
    });

    if (response.ok) {
      return { status: "success", message: "Password verified." };
    } else {
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Error verifying password",
      };
    }
  } catch (err) {
    console.error("Login error:", err);

    return {
      status: "error",
      message: "Internal server error",
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

      return { status: "success", message: "User registered successfully." };
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
      // Add the verified field to the payload
      const updatedPayload = { ...payload, verified: true };

      // Re-sign the token with the updated payload
      const updatedToken = await new SignJWT(updatedPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1m") // Set the expiration time as needed
        .sign(secretKey);

      const response = await fetch(`${USER_SERVICE_URL}/auth/${payload.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${updatedToken}`, // Use the updated token
        },
      });

      if (response.ok) {
        const data = await response.json();

        await signUpSession.destroy();

        // Set session data
        session.userId = data.data.id; // Get user ID from the response
        session.username = data.data.username; // Get username from the response
        session.email = data.data.email;
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
          message:
            errorData.message || "There was a problem registering the user.",
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

  const response = await fetch(`${USER_SERVICE_URL}/users/${email}/request`, {
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

export const editUsername = async (newUsername: string) => {
  if (!newUsername) {
    return { status: "error", message: "No username provided" };
  }

  const session = await getSession();
  const secret = env("JWT_SECRET");

  if (!session.accessToken) {
    return { status: "error", message: "User session has expired" };
  }

  if (!secret) {
    return { status: "error", message: "Internal application error" };
  }

  try {
    const updatedToken = await updateTokenWithField(session.accessToken, "username", secret);
    const response = await fetch(
      `${USER_SERVICE_URL}/users/${session.userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${updatedToken}`,
        },
        body: JSON.stringify({
          username: newUsername,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();

      session.username = data.data.username;
      console.log(session.username);
      await session.save();

      return {
        status: "success",
        message: "Username was successfully updated",
      };
    } else {
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Error modifying username",
      };
    }
  } catch (err) {
    console.error("Change username error:", err);

    return {
      status: "error",
      message: "Internal server error",
    };
  }
};

export const editEmailRequest = async (newEmail: string) => {
  const emailChangeSession = await getEmailChangeSession();
  const session = await getSession();

  console.log(
    `${USER_SERVICE_URL}/users/${session.userId}/email-update-request`,
  );
  console.log(session.accessToken);

  try {
    // Make the signup request to your API
    const response = await fetch(
      `${USER_SERVICE_URL}/users/${session.userId}/email-update-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          email: newEmail,
        }),
      },
    );

    if (response.ok) {
      const res = await response.json();

      emailChangeSession.emailToken = res.data.token;
      emailChangeSession.ttl = res.data.expiry;

      await emailChangeSession.save();

      return { status: "success", message: "Email change request successful" }; // Return success status
    } else {
      // Handle error response (e.g., show error message)
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Email change request failed.",
      }; // Return error status
    }
  } catch (error) {
    console.error("Email change request error:", error);

    return {
      status: "error",
      message: "Unable to reach the user service. Please try again later.",
    };
  }
};

export const verifyEmailCode = async (code: number, newEmail: string) => {
  const session = await getSession();
  const accessToken = await getAccessToken();
  const emailChangeSession = await getEmailChangeSession();

  console.log(code, newEmail);

  try {
    const emailToken = await getEmailChangeEmailToken();
    const secret = env("JWT_SECRET");

    if (!emailToken) {
      return {
        status: "error",
        message: "Token has expired or does not exist",
      };
    }

    if (!accessToken) {
      return {
        status: "error",
        message: "User session has expired",
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
      const updatedToken = await updateTokenWithField(accessToken, "email", secret);

      // If code matches, update the email
      console.log(newEmail);
      const response = await fetch(
        `${USER_SERVICE_URL}/users/${session.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${updatedToken}`, // Use the updated token
          },
          body: JSON.stringify({
            email: newEmail,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Update session with new email
        session.email = data.data.email;
        await session.save();

        // Clean up email change session
        await emailChangeSession.destroy();

        return {
          status: "success",
          message: "Email updated successfully!",
        };
      } else {
        const errorData = await response.json();

        return {
          status: "error",
          message: errorData.message || "Failed to update email.",
        };
      }
    } else {
      return {
        status: "error",
        message: "Verification code is incorrect. Please try again.",
      };
    }
  } catch (error) {
    console.error("Error verifying email code:", error);

    return {
      status: "error",
      message: "There was an error validating your code.",
    };
  }
};

export const clearEmailChangeSession = async () => {
  const emailChangeSession = await getEmailChangeSession();

  await emailChangeSession.destroy();
};

export const changePassword = async (newPassword: string) => {
  const session = await getSession();

  const secret = env("JWT_SECRET");

  if (!session.accessToken) {
    return { status: "error", message: "User session has expired" };
  }

  if (!secret) {
    return { status: "error", message: "Internal application error" };
  }

  try {
    const updatedToken = await updateTokenWithField(session.accessToken, "password", secret);

    const response = await fetch(
      `${USER_SERVICE_URL}/users/${session.userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${updatedToken}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      },
    );

    if (response.ok) {
      return { status: "success", message: "Password updated successfully" };
    } else {
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Failed to update password",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Unable to reach the user service. Please try again later.",
    };
  }
};

export const resetPassword = async (newPassword: string) => {
  const session = await getResetPasswordSession();

  try {
    const secret = env("JWT_SECRET");
    const resetToken = await getResetPasswordToken();

    if (!resetToken) {
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
    const { payload } = await jwtVerify(resetToken, secretKey);

    const userId = payload.id;

    const updatedToken = await updateTokenWithField(resetToken, "password", secret);

    const response = await fetch(`${USER_SERVICE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${updatedToken}`,
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    });

    if (response.ok) {
      await session.destroy();
      return { status: "success", message: "Password updated successfully" };
    } else {
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Failed to update password",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Unable to reach the user service. Please try again later.",
    };
  }
};

export const deleteUser = async () => {
  const session = await getSession();
  const accessToken = await getAccessToken();

  const secret = env("JWT_SECRET");

  if (!session.accessToken) {
    return { status: "error", message: "User session has expired" };
  }

  if (!secret) {
    return { status: "error", message: "Internal application error" };
  }

  const updatedToken = await updateTokenWithField(session.accessToken, "delete", secret);

  const response = await fetch(`${USER_SERVICE_URL}/users/${session.userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${updatedToken}`,
    },
  });

  if (response.ok) {
    await session.destroy();

    return {
      status: "success",
      message: "Your account has been deleted succesfully",
    };
  } else {
    return {
      status: "error",
      message: "There was an error with deleting your account",
    };
  }
};

export const forgetPassword = async (identifier: string) => {
  const resetPasswordSession = await getResetPasswordSession();

  try {
    const response = await fetch(`${USER_SERVICE_URL}/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: identifier,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      resetPasswordSession.resetToken = data.data.token;
      await resetPasswordSession.save();

      return {
        status: "success",
        message: "Password reset request successful.",
      };
    } else if (response.status === 401) {
      return {
        status: "warning",
        message: "You do not have an account with us!",
      };
    } else {
      const errorData = await response.json();

      return {
        status: "error",
        message: errorData.message || "Sign up failed.",
      };
    }
  } catch (error) {
    console.error("Reset password error:", error);

    return {
      status: "error",
      message: "Unable to reset password. Please try again later.",
    };
  }
};

async function updateTokenWithField(token: string, field: string, secret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);

  try {
    // Verify the token and extract the payload
    const { payload } = await jwtVerify(token, secretKey);

    // Add the new field to the payload
    const updatedPayload = { ...payload, field };

    // Re-sign the token with the updated payload
    const updatedToken = await new SignJWT(updatedPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1m") // Set the expiration time as needed
      .sign(secretKey);

    return updatedToken;
  } catch (error) {
    console.error("Error updating token:", error);
    throw new Error("Failed to update token");
  }
}
