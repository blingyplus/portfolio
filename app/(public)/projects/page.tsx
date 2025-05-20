// app/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { projectsCollection } from "@/app/lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/app/components/loading";
import ErrorMessage from "@/app/components/error";
import AppwriteImage from "@/app/components/AppwriteImage";
import { SkeletonLoader } from "@/app/components/skeleton-loader";
import { Metadata } from "next";

interface Project {
  $id: string;
  $createdAt: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

const ITEMS_PER_PAGE = 6;

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.innerText || tempDiv.textContent || "";
};

// Generate metadata for the projects listing page
export const metadata: Metadata = {
  title: "Projects | Russel Boakye Dankwa - Web Development Portfolio",
  description: "Explore the portfolio of projects by Russel Boakye Dankwa (Russel Bling), showcasing web development, software engineering, and technical expertise.",
  keywords: ["Russel Boakye Dankwa", "Russel Bling", "Projects", "Portfolio", "Web Development", "Software Engineering", "Full Stack Development"],
  authors: [{ name: "Russel Boakye Dankwa" }],
  openGraph: {
    title: "Projects | Russel Boakye Dankwa - Web Development Portfolio",
    description: "Explore the portfolio of projects by Russel Boakye Dankwa (Russel Bling), showcasing web development, software engineering, and technical expertise.",
    type: "website",
    siteName: "Russel Boakye Dankwa Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Russel Boakye Dankwa - Web Development Portfolio",
    description: "Explore the portfolio of projects by Russel Boakye Dankwa (Russel Bling), showcasing web development and software engineering work.",
    creator: "@your_twitter_handle",
  },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsCollection.getAll();
        // Sort projects by creation date (newest first)
        const sortedProjects = (data as unknown as Project[]).sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
        setProjects(sortedProjects);
        setError(null);
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <SkeletonLoader count={6} type="project" />
      </div>
    );
  }
  if (error) return <ErrorMessage message={error} />;

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 sm:space-y-14 px-2 sm:px-4 lg:px-8">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <Link href={`/projects/${project.$id}`} key={project.$id} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <AppwriteImage src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{stripHtmlTags(project.description)}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">View Details</span>
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    Live Project
                  </a>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
