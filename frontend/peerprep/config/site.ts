export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
      icon: "bxs-dashboard",
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
