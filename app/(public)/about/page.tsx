// app/about/page.tsx
"use client";
import { useState, useEffect } from "react";
import { aboutCollection } from "@/app/lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "@/app/components/loading";
import ErrorMessage from "@/app/components/error";

interface AboutData {
  content: string;
  skills: string[];
}

function decodeHTMLEntities(text: string) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Check if data exists in localStorage
        const cachedData = localStorage.getItem("aboutData");
        const cachedTimestamp = localStorage.getItem("aboutDataTimestamp");
        const now = new Date().getTime();

        // Use cached data if it exists and is less than 24 hours old
        if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < 24 * 60 * 60 * 1000) {
          setAboutData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        setLoading(true);
        const data = await aboutCollection.get();
        const processedData = {
          ...(data as unknown as AboutData),
          content: decodeHTMLEntities(data.content),
        };

        // Cache the data and timestamp
        localStorage.setItem("aboutData", JSON.stringify(processedData));
        localStorage.setItem("aboutDataTimestamp", now.toString());

        setAboutData(processedData);
        setError(null);
      } catch {
        setError("Failed to fetch about data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 8sm:py-12">
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
      </div>
    </div>
  );
}
