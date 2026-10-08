// app/(public)/about/AboutClient.tsx
"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import { aboutCollection } from "@/app/lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/app/components/loading";
import ErrorMessage from "@/app/components/error";
import { siteConfig } from "@/app/config/site";

import type { AboutData } from "@/app/lib/content";

export default function AboutClient({ initialAbout = null }: { initialAbout?: AboutData | null }) {
  const [aboutData, setAboutData] = useState<AboutData | null>(initialAbout);
  const [loading, setLoading] = useState(initialAbout === null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    // Old versions of this page cached the content in the browser for 24 hours,
    // which hid edits from returning visitors. Clear that leftover cache.
    try {
      localStorage.removeItem("aboutData");
      localStorage.removeItem("aboutDataTimestamp");
    } catch {
      // Storage can be unavailable (private mode); nothing to clean up then.
    }

    // Server already supplied the content; only fetch in the browser as a fallback.
    if (initialAbout !== null) return;

    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutCollection.get();
        if (data) {
          setAboutData({ content: data.content, skills: data.skills ?? [] });
        }
        setError(null);
      } catch {
        setError("Failed to fetch about data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, [initialAbout]);

  useEffect(() => {
    if (aboutData) {
      updateYearsOfExperience();
    }
  }, [aboutData]);

  const updateYearsOfExperience = () => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - startYear;
    const contentElement = document.getElementById("yearsOfExperience");
    if (contentElement) {
      contentElement.textContent = yearsOfExperience.toString();
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!aboutData) return <ErrorMessage message="No data available." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h1>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: aboutData.content }} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {aboutData.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <a href={siteConfig.urls.meeting} target="_blank" rel="noopener noreferrer">
              Schedule a Meeting
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
