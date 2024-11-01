import { SessionOptions } from "iron-session";
import { env } from "next-runtime-env";

const SECRET_KEY =
  env("SECRET_KEY") || "ThisIsASecretKeyMaybeYouShouldChangeIt";

export interface SessionData {
  userId?: string;
  username?: string;
  email?: string;
  isAdmin: boolean;
  accessToken?: string;
  isLoggedIn: boolean;
}

export interface CreateUserSessionData {
  emailToken?: string;
  isPending: boolean;
  ttl?: string;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  isAdmin: false,
};

export const sessionOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "peerprep-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60,
  },
};

export const createUserOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "user-creation-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3 * 60,
  },
};
