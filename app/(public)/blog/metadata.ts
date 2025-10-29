import { Metadata } from "next";
import { siteConfig } from "@/app/config/site";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.personal.fullName} - Web Development & Technology Articles`,
  description: `Read articles by ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}) about web development, programming, and technology. Stay updated with the latest insights and tutorials.`,
  keywords: [siteConfig.personal.fullName, siteConfig.personal.nickname, "Blog", "Web Development", "Programming", "Technology", "Tutorials", "Articles"],
  authors: [{ name: siteConfig.personal.fullName }],
  openGraph: {
    title: `Blog | ${siteConfig.personal.fullName} - Web Development & Technology Articles`,
    description: `Read articles by ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}) about web development, programming, and technology. Stay updated with the latest insights and tutorials.`,
    type: "website",
    siteName: siteConfig.brand.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.personal.fullName} - Web Development & Technology Articles`,
    description: `Read articles by ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}) about web development, programming, and technology.`,
    creator: siteConfig.social.twitter,
  },
};
