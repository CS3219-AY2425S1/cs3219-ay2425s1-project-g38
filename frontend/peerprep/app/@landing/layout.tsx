import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";

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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
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
    </section>
  );
}
