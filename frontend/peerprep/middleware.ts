export { auth as middleware } from "@/auth"

export const config = {
    matcher: ["/home", "/questions-management/:path*"], // Block both routes
  };
