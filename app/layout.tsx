// app/layout.tsx
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-8">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Russel Boakye Dankwa | Full Stack Developer Portfolio",
  description: "Portfolio website of Russel Boakye Dankwa (Russel Bling), a Full Stack Developer specializing in modern web technologies. Explore my projects, blog posts, and professional journey.",
  keywords: ["Russel Boakye Dankwa", "Russel Bling", "Full Stack Developer", "Web Developer", "Software Engineer", "Portfolio", "Projects", "Blog"],
  authors: [{ name: "Russel Boakye Dankwa" }],
  creator: "Russel Boakye Dankwa",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blingyplus.com",
    title: "Russel Boakye Dankwa | Full Stack Developer Portfolio",
    description: "Portfolio website of Russel Boakye Dankwa (Russel Bling), a Full Stack Developer specializing in modern web technologies. Explore my projects, blog posts, and professional journey.",
    siteName: "Russel Boakye Dankwa Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Russel Boakye Dankwa | Full Stack Developer Portfolio",
    description: "Portfolio website of Russel Boakye Dankwa (Russel Bling), a Full Stack Developer specializing in modern web technologies.",
    creator: "@blingyplus",
  },
};
