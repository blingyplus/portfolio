// app/admin/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { aboutCollection } from "../../lib/appwrite";
import { toast } from "@/components/ui/use-toast";
import Loading from "../../components/loading";
import ErrorMessage from "../../components/error";

interface AboutInfo {
  $id: string;
  content: string;
  skills: string[];
}

export default function AdminAbout() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      setLoading(true);
      const info = await aboutCollection.get();
      if (info) {
        setAboutInfo(info as unknown as AboutInfo);
        setFormData({
          content: info.content,
          skills: info.skills.join(", "),
        });
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch about information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updatedInfo = {
        content: formData.content,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };
      if (aboutInfo) {
        await aboutCollection.update(aboutInfo.$id, updatedInfo);
      } else {
        await aboutCollection.create(updatedInfo);
      }
      await fetchAboutInfo();
      toast({
        title: "Success",
        description: "About information updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update about information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage About Information</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update About Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea name="content" placeholder="About Content" value={formData.content} onChange={handleInputChange} required className="min-h-[200px]" />
            <Input name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleInputChange} />
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update About Information"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {aboutInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Current About Information</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Content:</h3>
            <p className="whitespace-pre-wrap mb-4">{aboutInfo.content}</p>
            <h3 className="font-semibold mb-2">Skills:</h3>
            <ul className="list-disc list-inside">
              {aboutInfo.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
