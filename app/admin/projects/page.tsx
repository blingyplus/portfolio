// app/admin/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectsCollection } from "../../lib/appwrite";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, "$id">>({
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
    technologies: [],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const fetchedProjects = await projectsCollection.getAll();
    setProjects(fetchedProjects as unknown as Project[]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const technologies = e.target.value.split(",").map((tech) => tech.trim());
    setNewProject((prev) => ({ ...prev, technologies }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await projectsCollection.create(newProject);
    setNewProject({
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      technologies: [],
    });
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    await projectsCollection.delete(id);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Project Title" value={newProject.title} onChange={handleInputChange} required />
            <Textarea name="description" placeholder="Project Description" value={newProject.description} onChange={handleInputChange} required />
            <Input name="imageUrl" placeholder="Image URL" value={newProject.imageUrl} onChange={handleInputChange} />
            <Input name="projectUrl" placeholder="Project URL" value={newProject.projectUrl} onChange={handleInputChange} />
            <Input name="technologies" placeholder="Technologies (comma-separated)" value={newProject.technologies.join(", ")} onChange={handleTechnologiesChange} />
            <Button type="submit">Add Project</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.$id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
              <p>Technologies: {project.technologies.join(", ")}</p>
              <Button variant="destructive" onClick={() => handleDelete(project.$id)} className="mt-4">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
