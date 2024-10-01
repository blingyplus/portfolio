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

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutCollection.get();
        setAboutData(data as unknown as AboutData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch about data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!aboutData) return <ErrorMessage message="No data available." />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About Me</h1>
      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{aboutData.content}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {aboutData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
