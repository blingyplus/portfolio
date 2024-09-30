// app/layout.tsx
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Russel D Boakye",
  description: "Welcome to the personal portfolio of Russel Dankwa Boakye, a passionate software engineer and part-time graphic designer. Explore my projects, skills, and professional journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <header className="bg-background border-b">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <Link href="/" className="text-2xl font-bold">
                    My Portfolio
                  </Link>
                  <div className="flex items-center space-x-4">
                    <Link href="/about" className="text-foreground hover:underline">
                      About
                    </Link>
                    <Link href="/projects" className="text-foreground hover:underline">
                      Projects
                    </Link>
                    <Link href="/blog" className="text-foreground hover:underline">
                      Blog
                    </Link>
                    <ThemeToggle />
                  </div>
                </nav>
              </header>
              <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
              <footer className="bg-background border-t">
                <div className="container mx-auto px-4 py-3 text-center">© 2023 My Portfolio. All rights reserved.</div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
