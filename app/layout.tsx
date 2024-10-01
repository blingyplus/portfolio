// app/layout.tsx
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <header className="bg-background border-b">
                <nav className="container mx-auto px-2 py-3 flex justify-between items-center">
                  <Link href="/" className="lg:text-2xl font-bold sm:text-xl">
                    blingyplus.
                  </Link>
                  <div className="flex items-center space-x-3 ml-auto">
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
                <div className="container mx-auto px-4 py-3 text-center">© {new Date().getFullYear()} blingyplus. All rights reserved.</div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "blingyplus.",
  description: "Welcome to my personal portfolio website",
};
