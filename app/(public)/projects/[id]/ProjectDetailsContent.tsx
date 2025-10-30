"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppwriteImage from "@/app/components/AppwriteImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projectsCollection } from "@/app/lib/appwrite";
import ImageViewer from "@/app/components/ImageViewer";
import ErrorMessage from "@/app/components/error";
import Loading from "@/app/components/loading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/app/config/site";

interface Project {
  $id: string;
  title: string;
  description?: string;
  descriptionLong?: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

export default function ProjectDetailsContent() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      if (!id) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        const projectData = await projectsCollection.getAll();
        const list = projectData as unknown as Project[];
        const foundProject = list.find((p) => p.$id === id);

        if (foundProject) {
          setProject(foundProject);
          // pick up to 3 other projects (newest first if $createdAt exists)
          const shuffle = (arr: Project[]) => {
            const a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
          };
          const others = shuffle(list.filter((p) => p.$id !== id)).slice(0, 3);
          setOtherProjects(others);
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

  // Ensure browser tab shows the project title even if SSR metadata could not fetch it
  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} | ${siteConfig.personal.fullName}`;
    }
  }, [project?.title]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  if (!project) {
    return <div>Project not found</div>;
  }

  const html = project.descriptionLong ?? project.description ?? "";
  const stripHtmlTags = (raw: string) => {
    const el = document.createElement("div");
    el.innerHTML = raw;
    return el.innerText || el.textContent || "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-hidden">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 break-words">{project.title}</h1>
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

        <div className="prose prose-lg dark:prose-invert max-w-none break-words">
          <div dangerouslySetInnerHTML={{ __html: html }} />
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
      {otherProjects.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Explore other projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((p) => (
              <Link href={`/projects/${p.$id}`} key={p.$id} className="group">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {p.imageUrl && (
                    <AppwriteImage src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover rounded-t-lg" />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors break-words">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-2 break-words">{stripHtmlTags(p.descriptionLong ?? p.description ?? "")}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
