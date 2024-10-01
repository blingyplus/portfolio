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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{blogPostCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
