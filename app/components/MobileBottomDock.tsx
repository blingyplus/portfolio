"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const MobileBottomDock = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      // Hide when within 100px of the bottom, show otherwise
      setIsVisible(scrollBottom > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "sm:flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-24"
      )}
    >
      <div className="flex items-center justify-around gap-1 px-3 py-3 bg-background/70 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center px-2.5 sm:px-3 py-2 rounded-full transition-all duration-200 active:scale-95 font-medium text-xs sm:text-sm whitespace-nowrap",
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
