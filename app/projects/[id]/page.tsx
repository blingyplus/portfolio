// app/projects/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projectsCollection } from "../../lib/appwrite";
import AppwriteImage from "../../components/AppwriteImage";
import ErrorMessage from "@/app/components/error";
import Loading from "@/app/components/loading";

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
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AppwriteImage src={project.imageUrl} alt={project.title} className="w-full h-auto object-cover rounded-lg" width={800} height={400} />
          <p className="text-lg">{project.description}</p>
          <div>
            <h3 className="text-xl font-semibold mb-2">Technologies Used:</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          {project.projectUrl && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Project Link:</h3>
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Project
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
