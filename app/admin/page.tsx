// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectsCollection, blogPostsCollection } from "../lib/appwrite";

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [blogPostCount, setBlogPostCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const projects = await projectsCollection.getAll();
      const blogPosts = await blogPostsCollection.getAll();
      setProjectCount(projects.length);
      setBlogPostCount(blogPosts.length);
    };
    fetchCounts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{projectCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Total projects in your portfolio</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{blogPostCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Total blog posts published</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
