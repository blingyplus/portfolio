// app/admin/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { projectsCollection } from "../../lib/appwrite";
import { TINYMCE_API_KEY, TINYMCE_CONFIG } from "../../lib/tinymce";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { stripHtmlTags } from "../../lib/utils";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

interface AppwriteError {
  message: string;
  code: number;
  type: string;
  version: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Omit<Project, "$id">>({
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
    technologies: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsCollection.getAll();
      setProjects(data as unknown as Project[]);
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error fetching projects:", appwriteError);
      toast({
        title: "Error",
        description: appwriteError.message || "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProject) {
      setEditingProject({ ...editingProject, [name]: value });
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (content: string) => {
    if (editingProject) {
      setEditingProject({ ...editingProject, description: content });
    } else {
      setNewProject((prev) => ({ ...prev, description: content }));
    }
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const technologies = e.target.value.split(",").map((tech) => tech.trim());
    if (editingProject) {
      setEditingProject({ ...editingProject, technologies });
    } else {
      setNewProject((prev) => ({ ...prev, technologies }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      const { $id, title, description, imageUrl, projectUrl, technologies } = editingProject;
      const dataToUpdate = {
        title,
        description,
        imageUrl,
        projectUrl,
        technologies,
      };
      try {
        await projectsCollection.update($id, dataToUpdate, imageFile || undefined);
        setEditingProject(null);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } catch (error) {
        const appwriteError = error as AppwriteError;
        console.error("Error updating project:", appwriteError);
        toast({
          title: "Error",
          description: appwriteError.message || "Failed to update project",
          variant: "destructive",
        });
      }
    } else {
      try {
        await projectsCollection.create(newProject, imageFile || undefined);
        setNewProject({
          title: "",
          description: "",
          imageUrl: "",
          projectUrl: "",
          technologies: [],
        });
        toast({
          title: "Success",
          description: "Project added successfully",
        });
      } catch (error) {
        const appwriteError = error as AppwriteError;
        console.error("Error creating project:", appwriteError);
        toast({
          title: "Error",
          description: appwriteError.message || "Failed to create project",
          variant: "destructive",
        });
      }
    }
    setImageFile(null);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsCollection.delete(id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error deleting project:", appwriteError);
      toast({
        title: "Error",
        description: appwriteError.message || "Failed to delete project",
        variant: "destructive",
      });
    }
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
          View Site
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>{editingProject ? "Edit Project" : "Add New Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Project Title" value={editingProject ? editingProject.title : newProject.title} onChange={handleInputChange} required className="w-full" />
            <div className="min-h-[300px]">
              <Editor apiKey={TINYMCE_API_KEY} init={TINYMCE_CONFIG} value={editingProject ? editingProject.description : newProject.description} onEditorChange={handleEditorChange} />
            </div>
            <div className="space-y-4">
              <Input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
              <Input name="projectUrl" placeholder="Project URL" value={editingProject ? editingProject.projectUrl : newProject.projectUrl} onChange={handleInputChange} className="w-full" />
              <Input
                name="technologies"
                placeholder="Technologies (comma-separated)"
                value={editingProject ? editingProject.technologies.join(", ") : newProject.technologies.join(", ")}
                onChange={handleTechnologiesChange}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="w-full sm:w-auto">
                {editingProject ? "Update Project" : "Add Project"}
              </Button>
              {editingProject && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Existing Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.$id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {project.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover rounded-t-lg" />
                  </div>
                )}
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{stripHtmlTags(project.description)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => handleEdit(project)} className="w-full sm:w-auto">
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(project.$id)} className="w-full sm:w-auto">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
