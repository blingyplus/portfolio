"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../lib/appwrite";
import { toast } from "@/components/ui/use-toast";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await account.getSession("current");
        console.log("Current session:", session);

        if (!session) {
          throw new Error("No active session");
        }

        const user = await account.get();
        console.log("Current user:", user);

        setIsLoading(false);
      } catch (error: any) {
        console.error("Auth check error:", error);
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/login") {
          toast({
            title: "Error",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
