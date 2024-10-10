export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/home",
      icon: "bxs-home",
    },
    {
      label: "Question Management",
      href: "/questions-management",
      icon: "bxs-message-square-edit",
    },
  ],
};
