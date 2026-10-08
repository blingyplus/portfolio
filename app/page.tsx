// app/page.tsx
// Server component: loads the featured content on the server so it is part of the
// initial HTML (visible to search engines and link previews), then hands it to the
// interactive client component.
import HomeClient from "./HomeClient";
import { getProjects, getBlogPosts } from "./lib/content";

// Refresh content from Appwrite at most every 5 minutes (must be a literal for Next.js).
export const revalidate = 300;

export default async function HomePage() {
  const [projects, blogPosts] = await Promise.all([getProjects(), getBlogPosts()]);

  return <HomeClient initialProjects={projects ? projects.slice(0, 3) : null} initialBlogPosts={blogPosts ? blogPosts.slice(0, 3) : null} />;
}
