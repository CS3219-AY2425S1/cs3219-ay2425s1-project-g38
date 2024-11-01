import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";
import { CollabNavbar } from "@/components/collaboration/CollabNavbar";

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

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-grow mx-6">
        <main className="flex-grow max-w-screen max-h-screen">{children}</main>
      </div>
    </section>
  );
}
