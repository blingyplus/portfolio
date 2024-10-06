// app/about/page.tsx
"use client";
import { useState, useEffect } from "react";
import { aboutCollection } from "../lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "../components/loading";
import ErrorMessage from "../components/error";

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
        setLoading(true);
        const data = await aboutCollection.get();
        setAboutData({
          ...(data as unknown as AboutData),
          content: decodeHTMLEntities(data.content),
        });
        setError(null);
      } catch (err) {
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
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">About Me</h1>
      <Card>
        <CardContent className="pt-6">
          <div id="about-content" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aboutData.content }} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {aboutData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
