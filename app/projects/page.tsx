// app/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { projectsCollection } from "../lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "../components/loading";
import ErrorMessage from "../components/error";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

const ITEMS_PER_PAGE = 6;

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
        setProjects(data as unknown as Project[]);
        setError(null);
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <Card key={project.$id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Project
              </a>
            </CardContent>
          </Card>
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
