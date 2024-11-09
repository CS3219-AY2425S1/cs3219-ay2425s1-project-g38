export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PeerPrep",
  description: "Peer-to-peer interview preparation platform",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
      icon: "bxs-dashboard",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: "bx-cog",
    },
  ],
  adminNavItems: [
    {
      label: "Question Management",
      href: "/questions-management",
      icon: "bxs-message-square-edit",
    },
  ],
};
