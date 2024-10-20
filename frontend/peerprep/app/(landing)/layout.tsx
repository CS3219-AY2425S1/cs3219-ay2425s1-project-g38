import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { PublicEnvScript } from "next-runtime-env";

import { Providers } from "../providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { auth } from "@/auth";
import { NavbarLoggedIn } from "@/components/navbarloggedin";
import { Sidebar } from "@/components/sidebar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

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
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            {session ? (
              <body
                className={clsx(
                  "min-h-screen bg-background font-sans antialiased",
                  fontSans.variable
                )}
              >
                <Providers
                  themeProps={{ attribute: "class", defaultTheme: "light" }}
                >
                  <div className="relative flex flex-col h-screen">
                    <NavbarLoggedIn />
                    <div className="flex flex-grow mx-6">
                      <Sidebar />
                      <main className="flex-grow max-w-screen">{children}</main>
                    </div>
                    <footer className="w-full flex items-center justify-center py-3" />
                  </div>
                </Providers>
              </body>
            ) : (
              <div>
                <div className="relative flex flex-col h-screen">
                  <div className="flex flex-grow mx-6 z-10">
                    <main className="flex-grow max-w-screen">{children}</main>
                  </div>
                </div>
                <div
                  className="fixed z-0 inset-0 w-full h-full bg-gradient-to-t from-fuchsia-400 to-violet-500 dark:from-teal-200 dark:to-violet-500 p-10 opacity-90"
                  style={{
                    clipPath: "polygon(100% 10%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                />
              </div>
            )}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
