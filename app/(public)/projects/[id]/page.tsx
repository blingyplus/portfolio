import { Metadata } from "next";
import { notFound } from "next/navigation";
import { stripHtmlTags } from "@/app/lib/utils";
import { getProjects, type Project } from "@/app/lib/content";
import ProjectDetailsContent from "./ProjectDetailsContent";
import { siteConfig } from "@/app/config/site";

// Refresh content from Appwrite at most every 5 minutes (must be a literal for Next.js).
export const revalidate = 300;

function projectImage(project: Project): string | undefined {
  return (project.images && project.images[0]) || project.imageUrl || undefined;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projects = await getProjects();
  const project = projects?.find((p) => p.$id === params.id);

  if (!project) {
    return projects
      ? { title: "Project Not Found", description: "The requested project could not be found." }
      : { title: `Project | ${siteConfig.personal.fullName}`, description: `View project details by ${siteConfig.personal.fullName}.` };
  }

  const description = stripHtmlTags(project.descriptionLong ?? project.description ?? "").substring(0, 160);
  const image = projectImage(project);

  return {
    title: project.title,
    description,
    keywords: [...project.technologies, siteConfig.personal.fullName, siteConfig.personal.nickname, "Projects", "Web Development"],
    authors: [{ name: siteConfig.personal.fullName }],
    alternates: { canonical: `/projects/${project.$id}` },
    openGraph: {
      title: project.title,
      description,
      type: "website",
      url: `/projects/${project.$id}`,
      siteName: siteConfig.brand.siteName,
      ...(image ? { images: [{ url: image, alt: project.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      creator: siteConfig.social.twitter,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const projects = await getProjects();

  // Server could not reach Appwrite: let the client fetch instead of failing the page.
  if (!projects) return <ProjectDetailsContent />;

  const project = projects.find((p) => p.$id === params.id);
  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.$id !== params.id).slice(0, 3);
  return <ProjectDetailsContent initialProject={project} initialOtherProjects={otherProjects} />;
}
