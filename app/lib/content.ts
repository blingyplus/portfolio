// app/lib/content.ts
// Server-side data loaders for the public pages. Pages call these at render time so
// the HTML sent to browsers, search engines and link previews already contains the
// content. Each returns null on failure so the page can fall back to client fetching.
import { projectsCollection, blogPostsCollection, aboutCollection } from "./appwrite";

export interface Project {
  $id: string;
  $createdAt: string;
  title: string;
  description?: string;
  descriptionLong?: string;
  imageUrl: string;
  images?: string[];
  projectUrl: string;
  technologies: string[];
}

export interface BlogPost {
  $id: string;
  $createdAt: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
  imageUrl?: string;
}

export interface AboutData {
  content: string;
  skills: string[];
}

const newestFirst = <T extends { $createdAt: string }>(a: T, b: T) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();

export async function getProjects(): Promise<Project[] | null> {
  try {
    const docs = (await projectsCollection.getAll()) as unknown as Project[];
    return [...docs].sort(newestFirst);
  } catch (err) {
    console.error("Failed to load projects on the server:", err);
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[] | null> {
  try {
    const docs = (await blogPostsCollection.getAll()) as unknown as BlogPost[];
    return [...docs].sort(newestFirst);
  } catch (err) {
    console.error("Failed to load blog posts on the server:", err);
    return null;
  }
}

export async function getAbout(): Promise<AboutData | null> {
  try {
    const doc = (await aboutCollection.get()) as unknown as AboutData | null;
    return doc ? { content: doc.content, skills: doc.skills ?? [] } : null;
  } catch (err) {
    console.error("Failed to load about info on the server:", err);
    return null;
  }
}
