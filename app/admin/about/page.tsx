// app/admin/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { aboutCollection } from "../../lib/appwrite";
import { toast } from "@/components/ui/use-toast";
import Loading from "../../components/loading";
import ErrorMessage from "../../components/error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TINYMCE_API_KEY, TINYMCE_CONFIG } from "../../lib/tinymce";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    fetchAboutInfo();
    updateYearsOfExperience();
  }, []);

  const updateYearsOfExperience = () => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - startYear;
    const contentElement = document.getElementById("about-content");
    if (contentElement) {
      contentElement.innerHTML = contentElement.innerHTML.replace(/\d+(?=\s*years of professional experience)/, yearsOfExperience.toString());
    }
  };

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
    } catch {
      setError("Failed to fetch about information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async () => {
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
    } catch {
      toast({
        title: "Error",
        description: "Failed to update about information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Manage About Page</h1>
        <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
          View Site
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>Edit About Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="min-h-[300px]">
              <Editor apiKey={TINYMCE_API_KEY} init={TINYMCE_CONFIG} value={formData.content} onEditorChange={handleEditorChange} />
            </div>
            <Input name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleInputChange} className="w-full" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? "Updating..." : "Update About Information"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action will update the about information. Are you sure you want to continue?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
