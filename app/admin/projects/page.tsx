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
      setProjects(data as Project[]);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch projects",
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
      } catch (error: any) {
        console.error("Error updating project:", error);
        toast({
          title: "Error",
          description: error?.message || "Failed to update project",
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
      } catch (error: any) {
        console.error("Error creating project:", error);
        toast({
          title: "Error",
          description: error?.message || "Failed to create project",
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
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete project",
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button onClick={() => router.push("/")}>View Site</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{editingProject ? "Edit Project" : "Add New Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Project Title" value={editingProject ? editingProject.title : newProject.title} onChange={handleInputChange} required />
            <Editor apiKey={TINYMCE_API_KEY} init={TINYMCE_CONFIG} value={editingProject ? editingProject.description : newProject.description} onEditorChange={handleEditorChange} />
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <Input name="projectUrl" placeholder="Project URL" value={editingProject ? editingProject.projectUrl : newProject.projectUrl} onChange={handleInputChange} />
            <Input
              name="technologies"
              placeholder="Technologies (comma-separated)"
              value={editingProject ? editingProject.technologies.join(", ") : newProject.technologies.join(", ")}
              onChange={handleTechnologiesChange}
            />
            <div className="flex space-x-2">
              <Button type="submit">{editingProject ? "Update" : "Add"} Project</Button>
              {editingProject && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.$id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: project.description.substring(0, 200) + "..." }} />
              {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="mt-2 max-w-full h-auto" />}
              <p>Technologies: {project.technologies.join(", ")}</p>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleEdit(project)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(project.$id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
