// app/(public)/blog/page.tsx
// Server component: renders the post list into the initial HTML for search engines
// and link previews, then hands it to the interactive client component.
import BlogClient from "./BlogClient";
import { getBlogPosts } from "@/app/lib/content";
export { metadata } from "./metadata";

// Refresh content from Appwrite at most every 5 minutes (must be a literal for Next.js).
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogClient initialPosts={posts} />;
}
