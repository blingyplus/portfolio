/**
 * Site Configuration File
 *
 * This file contains all personal information, branding, URLs, and site metadata.
 * To customize this portfolio for your own use, simply update the values below.
 *
 * All hardcoded values throughout the codebase reference this configuration file,
 * making it easy to personalize the portfolio without digging through multiple files.
 */

export const siteConfig = {
  // Personal Information
  personal: {
    fullName: "Russel Boakye Dankwa",
    displayName: "Russel Dankwa Boakye", // Name as displayed on homepage
    nickname: "Russel Bling", // Alternative name/nickname
    email: "russelboakye@gmail.com",
    phone: "+233240608256",
    location: "Ghana", // Optional: for keywords/metadata
  },

  // Branding
  brand: {
    name: "blingyplus", // Brand name (used in navbar, footer, etc.)
    siteName: "Russel Boakye Dankwa Portfolio", // Full site name for SEO
  },

  // URLs
  urls: {
    site: "https://blingyplus.com", // Your portfolio site URL
    github: "https://github.com/blingyplus",
    githubRepo: "https://github.com/blingyplus/portfolio", // Portfolio source code
    linkedin: "https://www.linkedin.com/in/russel-dankwa-boakye-904252255/",
    upwork: process.env.NEXT_PUBLIC_UPWORK_URL || "https://www.upwork.com/freelancers/~01304d3a781037ba57?mp_source=share",
  },

  // Social Media
  social: {
    twitter: "@blingyplus", // Twitter/X handle (with @ symbol)
    githubUsername: "blingyplus", // GitHub username
  },

  // Images
  images: {
    profile: "/assets/russel.png", // Path to profile image
    alt: "Russel", // Alt text for profile image
  },

  // Metadata & SEO
  metadata: {
    defaultTitle: "Full Stack Developer Portfolio",
    defaultDescription: "Full Stack Developer specializing in modern web technologies. Explore my projects, blog posts, and professional journey.",
    defaultKeywords: ["Full Stack Developer", "Web Developer", "Software Engineer", "Portfolio", "Projects", "Blog"],
    tagline: "Full-Stack Developer turning coffee and curiosity into working code. I build things that matter.", // Homepage tagline
  },

  // Footer
  footer: {
    builtByText: "Built by", // Text before your name in footer
    footerPersonName: "Russel Boakye", // Name to display in footer (usually first + last name)
    sourceCodeText: "The source code is available on", // Text before GitHub link
  },
};

// Helper function to generate full title
export function getFullTitle(pageTitle?: string): string {
  const base = `${siteConfig.personal.fullName} | ${siteConfig.metadata.defaultTitle}`;
  return pageTitle ? `${pageTitle} | ${siteConfig.personal.fullName}` : base;
}

// Helper function to generate description with personal info
export function getDescription(description?: string): string {
  const base = `Portfolio website of ${siteConfig.personal.fullName} (${siteConfig.personal.nickname}), a ${siteConfig.metadata.defaultDescription}`;
  return description || base;
}
