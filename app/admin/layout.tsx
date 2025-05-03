// app/admin/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { logout } from "../lib/auth";
import { toast } from "@/components/ui/use-toast";
import { AuthCheck } from "../components/auth-check";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link href="/admin" className="mr-6 flex items-center space-x-2">
                <span className="font-bold">Admin Dashboard</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
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
            <div className="flex flex-1 items-center justify-end space-x-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </div>
    </AuthCheck>
  );
}
