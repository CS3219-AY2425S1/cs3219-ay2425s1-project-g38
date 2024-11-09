import "@/styles/globals.css";
import { Viewport } from "next";
import clsx from "clsx";
import { PublicEnvScript } from "next-runtime-env";

import { isSessionLoggedIn } from "../auth/actions";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  application,
  landing,
}: {
  application: React.ReactNode;
  landing: React.ReactNode;
}) {
  const isLoggedIn = await isSessionLoggedIn();

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <PublicEnvScript />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <main className="flex-grow max-w-screen">
            {isLoggedIn && application}
            {!isLoggedIn && landing}
          </main>
        </Providers>
      </body>
    </html>
  );
}
