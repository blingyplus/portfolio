import { Metadata } from "next";
import { projectsCollection } from "@/app/lib/appwrite";
import { stripHtmlTags } from "@/app/lib/utils";
import ProjectDetailsContent from "./ProjectDetailsContent";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const projects = await projectsCollection.getAll();
    const project = (projects as unknown as Project[]).find((p) => p.$id === params.id);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    const strippedDescription = stripHtmlTags(project.description).substring(0, 160);

    return {
      title: project.title,
      description: strippedDescription,
      keywords: [...project.technologies, "Russel Boakye Dankwa", "Russel Bling", "Projects", "Web Development"],
      authors: [{ name: "Russel Boakye Dankwa" }],
      openGraph: {
        title: project.title,
        description: strippedDescription,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: strippedDescription,
        creator: "@blingyplus",
      },
    };
  } catch (error) {
    return {
      title: "Project | Russel Boakye Dankwa",
      description: "View project details by Russel Boakye Dankwa.",
    };
  }
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return <ProjectDetailsContent />;
}
