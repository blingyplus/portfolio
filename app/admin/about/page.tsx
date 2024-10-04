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
          <div className="space-y-4">
            <Editor
              apiKey="3gfikj0e15e3l5jsh9qyiq3gcpzr7pmnvh48nrammlonb6jl"
              init={{
                height: 300,
                menubar: false,
                plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount"],
                toolbar: "undo redo | formatselect | " + "bold italic backcolor | alignleft aligncenter " + "alignright alignjustify | bullist numlist outdent indent | " + "removeformat | help",
              }}
              value={formData.content}
              onEditorChange={handleEditorChange}
            />
            <Input name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleInputChange} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={submitting}>{submitting ? "Updating..." : "Update About Information"}</Button>
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
          </div>
        </CardContent>
      </Card>
      {aboutInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Current About Information</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Content:</h3>
            <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: aboutInfo.content }} />
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
