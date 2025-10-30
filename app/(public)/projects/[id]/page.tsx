import { Metadata } from "next";
import { projectsCollection } from "@/app/lib/appwrite";
import { stripHtmlTags } from "@/app/lib/utils";
import ProjectDetailsContent from "./ProjectDetailsContent";
import { siteConfig } from "@/app/config/site";

interface Project {
  $id: string;
  title: string;
  description?: string;
  descriptionLong?: string;
  imageUrl?: string;
  images?: string[];
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

    const descHtml = project.descriptionLong ?? project.description ?? "";
    const strippedDescription = stripHtmlTags(descHtml).substring(0, 160);

    return {
      title: project.title,
      description: strippedDescription,
      keywords: [...project.technologies, siteConfig.personal.fullName, siteConfig.personal.nickname, "Projects", "Web Development"],
      authors: [{ name: siteConfig.personal.fullName }],
      openGraph: {
        title: project.title,
        description: strippedDescription,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: strippedDescription,
        creator: siteConfig.social.twitter,
      },
    };
  } catch (error) {
    return {
      title: `Project | ${siteConfig.personal.fullName}`,
      description: `View project details by ${siteConfig.personal.fullName}.`,
    };
  }
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return <ProjectDetailsContent />;
}
