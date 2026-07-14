/** Oficjalne profile ICAROS Polska w social mediach. */
export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/icaros_polska/",
  },
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/icarospl/",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/icaros-polska",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@ICAROSPOLSKA",
  },
];
