// app/admin/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { logout } from "../lib/auth";
import { toast } from "@/components/ui/use-toast";
import { AuthCheck } from "../components/auth-check";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toast({
        title: "Success",
        description: "Logged out successfully.",
      });
      router.push("/login");
    } else {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto flex h-16 items-center px-4">
            <div className="mr-4 flex items-center">
              <Link href="/admin" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-lg">Admin Dashboard</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="/admin/projects" className="transition-colors hover:text-foreground/80">
                  Projects
                </Link>
                <Link href="/admin/blog" className="transition-colors hover:text-foreground/80">
                  Blog
                </Link>
                <Link href="/admin/about" className="transition-colors hover:text-foreground/80">
                  About
                </Link>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout} className="hidden md:inline-flex">
                Logout
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t">
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                <nav className="flex flex-col space-y-4">
                  <Link href="/admin/projects" className="text-sm font-medium transition-colors hover:text-foreground/80" onClick={() => setIsMobileMenuOpen(false)}>
                    Projects
                  </Link>
                  <Link href="/admin/blog" className="text-sm font-medium transition-colors hover:text-foreground/80" onClick={() => setIsMobileMenuOpen(false)}>
                    Blog
                  </Link>
                  <Link href="/admin/about" className="text-sm font-medium transition-colors hover:text-foreground/80" onClick={() => setIsMobileMenuOpen(false)}>
                    About
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                    Logout
                  </Button>
                </nav>
              </div>
            </div>
          )}
        </header>
        <main className="container px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </AuthCheck>
  );
}
