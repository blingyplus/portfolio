// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsCollection, blogPostsCollection } from "./lib/appwrite";
import TechStackCarousel from "./components/TechStackCarousel";
import AppwriteImage from "./components/AppwriteImage";
import Loading from "./components/loading";
import ErrorMessage from "./components/error";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface BlogPost {
  $id: string;
  title: string;
  slug: string;
  content: string;
}
export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, blogPostsData] = await Promise.all([projectsCollection.getAll(), blogPostsCollection.getAll()]);

        setProjects(projectsData.slice(0, 3) as unknown as Project[]);
        setBlogPosts(blogPostsData.slice(0, 3) as unknown as BlogPost[]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 sm:space-y-14 px-2 sm:px-4 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center justify-between min-h-[80vh] py-8 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full mb-8 gap-8">
          <div className="lg:w-1/2 flex flex-col items-center">
            <img src="/assets/russel.png" alt="Russel" className="rounded-full w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-cover" />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="max-w-md mx-auto lg:mx-0">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Russel Dankwa Boakye</h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6">Full-Stack Software Developer. | Crafting innovative digital solutions with code and creativity</p>
              <Button asChild>
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <TechStackCarousel />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div key={project.$id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 * index, duration: 0.5 }}>
              <Card className="overflow-hidden">
                <AppwriteImage src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                  <Button asChild className="mt-4">
                    <Link href={`/projects/${project.$id}`}>View Project</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div key={post.$id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 * index, duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                  <Button asChild className="mt-4">
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
