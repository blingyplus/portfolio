import { Metadata } from "next";
import { siteConfig, getFullTitle } from "@/app/config/site";

export const metadata: Metadata = {
  title: "About Me",
  description: `Learn more about ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), a Full Stack Developer with expertise in modern web technologies and software engineering.`,
  keywords: [siteConfig.personal.fullName, siteConfig.personal.nickname, "About", siteConfig.personal.location, "Full Stack Developer", "Web Developer", "Software Engineer"],
  authors: [{ name: siteConfig.personal.fullName }],
  openGraph: {
    title: `About Me | ${siteConfig.personal.fullName}`,
    description: `Learn more about ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), a Full Stack Developer with expertise in modern web technologies.`,
    type: "website",
    siteName: siteConfig.brand.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `About Me | ${siteConfig.personal.fullName}`,
    description: `Learn more about ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), a Full Stack Developer with expertise in modern web technologies.`,
    creator: siteConfig.social.twitter,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
