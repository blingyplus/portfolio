import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about Russel Boakye Dankwa (Russel Bling), a Full Stack Developer with expertise in modern web technologies and software engineering.",
  keywords: ["Russel Boakye Dankwa", "Russel Bling", "About", "Ghana", "Africa", "Full Stack Developer", "Web Developer", "Software Engineer"],
  authors: [{ name: "Russel Boakye Dankwa" }],
  openGraph: {
    title: "About Me | Russel Boakye Dankwa",
    description: "Learn more about Russel Boakye Dankwa (Russel Bling), a Full Stack Developer with expertise in modern web technologies.",
    type: "website",
    siteName: "Russel Boakye Dankwa Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me | Russel Boakye Dankwa",
    description: "Learn more about Russel Boakye Dankwa (Russel Bling), a Full Stack Developer with expertise in modern web technologies.",
    creator: "@blingyplus",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
