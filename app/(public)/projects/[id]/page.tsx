// app/projects/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projectsCollection } from "@/app/lib/appwrite";
import ImageViewer from "@/app/components/ImageViewer";
import ErrorMessage from "@/app/components/error";
import Loading from "@/app/components/loading";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        const projectData = await projectsCollection.getAll();
        const foundProject = (projectData as unknown as Project[]).find((p) => p.$id === id);

        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {project.imageUrl && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <ImageViewer src={project.imageUrl} alt={project.title} className="object-cover w-full h-full" />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>

        {project.projectUrl && (
          <div className="pt-6">
            <Button asChild>
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
