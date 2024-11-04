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
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

interface Project {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  slug: string;
  publishDate?: string;
  tags?: string[];
  imageUrl?: string;
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

  const stripHtmlTags = (html: any) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };

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
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                {/* GitHub Icon */}
                <a href="https://github.com/blingyplus" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faGithub} className="text-2xl text-muted-foreground hover:text-primary transition-colors" />
                </a>
                {/* Email Icon */}
                <a href="mailto:russelboakye@gmail.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-muted-foreground hover:text-primary transition-colors" />
                </a>
              </div>
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
                  <p className="text-muted-foreground line-clamp-2">{stripHtmlTags(project.description)}</p>
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
              <Card className="flex flex-col h-full">
                {post.imageUrl && <AppwriteImage src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-muted-foreground line-clamp-3 mb-4">{stripHtmlTags(post.content)}</p>
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button asChild variant="outline">
                      <Link href={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                    {post.publishDate && <span className="text-sm text-muted-foreground">{new Date(post.publishDate).toLocaleDateString()}</span>}
                  </div>
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
