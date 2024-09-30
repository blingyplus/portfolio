// app/layout.tsx
import { AuthProvider } from "./contexts/AuthContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Russel D Boakye",
  description: "Welcome to the personal portfolio of Russel Dankwa Boakye, a passionate software engineer and part-time graphic designer. Explore my projects, skills, and professional journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
