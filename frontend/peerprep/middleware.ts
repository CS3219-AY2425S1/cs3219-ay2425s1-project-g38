import { NextResponse } from "next/server";

import { getCreateUserSession, getResetPasswordSession, getSession } from "./auth/actions";
import { checkUserMatchStatus } from "./services/sessionAPI";

export async function middleware(req: any) {
  const url = req.nextUrl.clone(); // Clone the URL
  const session = await getSession();
  const signUpSession = await getCreateUserSession();
  const resetPasswordSession = await getResetPasswordSession();
  const token = session?.accessToken; // Access token from the session
  const isAdmin = session?.isAdmin; // Admin status from the session
  const emailToken = signUpSession?.emailToken;

  // Handle reset password route
  if (url.pathname.startsWith('/sign-in/forgot-password/reset')) {
    const resetToken = url.searchParams.get('token');
    
    // If no token in URL or no reset password session, redirect to forgot password page
    if (!resetToken || !resetPasswordSession?.resetToken) {
      url.pathname = '/404';
      return NextResponse.redirect(url);
    }

    // Verify that the tokens match
    if (resetToken !== resetPasswordSession.resetToken) {
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token) {
    if (
      url.pathname.startsWith("/questions-management") ||
      url.pathname.startsWith("/session") ||
      url.pathname.startsWith("/settings")
    ) {
      url.pathname = "/sign-in";

      return NextResponse.redirect(url);
    }
    if (url.pathname.includes("email-verification") && !emailToken) {
      url.pathname = "/sign-up";

      return NextResponse.redirect(url);
    }
    if (url.pathname === "/sign-up" && emailToken) {
      url.pathname = "/sign-up/email-verification";

      return NextResponse.redirect(url);
    }
  } else {
    // Redirect authenticated users from sign-in and sign-up to home
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up")
    ) {
      url.pathname = "/";

      return NextResponse.redirect(url);
    }

    // Restrict access to `/questions-management` to admins only
    if (!isAdmin && url.pathname.startsWith("/questions-management")) {
      url.pathname = "/forbidden";

      return NextResponse.redirect(url);
    }

    // Check if the user is in a session

    if (url.pathname.startsWith("/session")) {
      const isInSession = await checkUserMatchStatus();

      if (!isInSession) {
        url.pathname = "/forbidden";

        return NextResponse.redirect(url);
      }
    }
  }

  // If no conditions match, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/questions-management/:path*",
    "/sign-in",
    "/sign-up/:path*",
    "/session",
    "/settings",
    "/sign-in/forgot-password/reset",
  ],
};
