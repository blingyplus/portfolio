// app/(public)/projects/page.tsx
// Server component: renders the project list into the initial HTML for search engines
// and link previews, then hands it to the interactive client component.
import ProjectsClient from "./ProjectsClient";
import { getProjects } from "@/app/lib/content";
export { metadata } from "./metadata";

// Refresh content from Appwrite at most every 5 minutes (must be a literal for Next.js).
export const revalidate = 300;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}
