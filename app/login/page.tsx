// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input id="email-address" name="email" type="email" autoComplete="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
