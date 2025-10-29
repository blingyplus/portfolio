import { Metadata } from "next";
import { siteConfig } from "@/app/config/site";

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.personal.fullName} - Web Development Portfolio`,
  description: `Explore the portfolio of projects by ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), showcasing web development, software engineering, and technical expertise.`,
  keywords: [siteConfig.personal.fullName, siteConfig.personal.nickname, "Projects", "Portfolio", "Web Development", "Software Engineering", "Full Stack Development"],
  authors: [{ name: siteConfig.personal.fullName }],
  openGraph: {
    title: `Projects | ${siteConfig.personal.fullName} - Web Development Portfolio`,
    description: `Explore the portfolio of projects by ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), showcasing web development, software engineering, and technical expertise.`,
    type: "website",
    siteName: siteConfig.brand.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${siteConfig.personal.fullName} - Web Development Portfolio`,
    description: `Explore the portfolio of projects by ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), showcasing web development and software engineering work.`,
    creator: siteConfig.social.twitter,
  },
};
