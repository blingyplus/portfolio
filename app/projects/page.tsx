// app/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { projectsCollection } from '../lib/appwrite';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await projectsCollection.getAll();
      setProjects(data as unknown as Project[]);
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.$id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Project
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}