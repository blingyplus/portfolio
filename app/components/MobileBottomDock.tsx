"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileBottomDock = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="sm:flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="flex items-center justify-around gap-1 px-4 py-3 bg-background/70 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 font-medium text-sm",
                isActive ? "text-primary bg-background/80 backdrop-blur-sm" : "text-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomDock;
