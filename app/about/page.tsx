// app/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { aboutCollection } from '../lib/appwrite';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface AboutData {
  content: string;
  skills: string[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      const data = await aboutCollection.get();
      setAboutData(data as unknown as AboutData);
    };
    fetchAboutData();
  }, []);

  if (!aboutData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About Me</h1>
      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{aboutData.content}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {aboutData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}