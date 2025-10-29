"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "../config/site";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ];

  // Swipe gesture detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isMenuOpen) {
      // Swipe right to open (touch starts on left, moves right)
      setIsMenuOpen(true);
    } else if (isRightSwipe && isMenuOpen) {
      // Swipe left to close (touch starts on right, moves left)
      setIsMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl border-border/50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl sm:text-2xl">
            {siteConfig.brand.name}.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground px-3 py-2 rounded-md",
                    pathname === item.href ? "text-foreground bg-background/60 backdrop-blur-sm" : "text-foreground/70 hover:bg-background/40 hover:backdrop-blur-sm"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Hamburger Menu Button - Only for very small screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden rounded-full px-3 py-2 bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Menu - For very small screens with swipe support */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/60 sm:hidden transition-opacity duration-300" onClick={() => setIsMenuOpen(false)} />

          {/* Slide-in Sidebar from Right */}
          <div
            ref={sidebarRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="fixed right-0 top-0 z-50 h-full w-72 sm:hidden bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out"
          >
            <nav className="flex flex-col h-full p-6 space-y-6">
              {/* Header with close button */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="rounded-full p-2 hover:bg-accent transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation items */}
              <div className="flex flex-col space-y-3 flex-1">
                {navItems.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all hover:translate-x-1",
                        pathname === item.href ? "text-foreground bg-accent" : "text-foreground/70 hover:bg-accent/50"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Footer hint for swipe */}
              <div className="pt-4 border-t text-center text-xs text-muted-foreground">Swipe left to close</div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
