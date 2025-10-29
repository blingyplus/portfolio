// app/layout.tsx
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileBottomDock from "./components/MobileBottomDock";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig, getFullTitle, getDescription } from "./config/site";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8 md:pb-8">{children}</main>
              <Footer />
              <MobileBottomDock />
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: getFullTitle(),
  description: getDescription(),
  keywords: [siteConfig.personal.fullName, siteConfig.personal.nickname, ...siteConfig.metadata.defaultKeywords],
  authors: [{ name: siteConfig.personal.fullName }],
  creator: siteConfig.personal.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.urls.site,
    title: getFullTitle(),
    description: getDescription(),
    siteName: siteConfig.brand.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: getFullTitle(),
    description: getDescription(),
    creator: siteConfig.social.twitter,
  },
};
