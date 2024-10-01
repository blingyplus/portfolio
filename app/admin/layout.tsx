// app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/blog", label: "Blog Posts" },
    { href: "/admin/about", label: "About" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150 ${
                  pathname === item.href ? "text-gray-900 bg-gray-100" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Button onClick={logout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-5">{children}</main>
    </div>
  );
}
