// app/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/app/lib/utils";

interface Project {
  $id: string;
  $createdAt: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

interface BlogPost {
  $id: string;
  $createdAt: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
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

        // Sort projects and blog posts by creation date (newest first)
        const sortedProjects = (projectsData as unknown as Project[]).sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
        const sortedBlogPosts = (blogPostsData as unknown as BlogPost[]).sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());

        setProjects(sortedProjects.slice(0, 3));
        setBlogPosts(sortedBlogPosts.slice(0, 3));
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

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 sm:space-y-14 px-2 sm:px-4 lg:px-8">
      {/* Hero Section - Static Content */}
      <div className="flex flex-col items-center justify-between min-h-[80vh] py-8 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full mb-8 gap-8">
          <div className="lg:w-1/2 flex flex-col items-center">
            <img src="/assets/russel.png" alt="Russel" className="rounded-full w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-cover" />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="max-w-md mx-auto lg:mx-0">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Russel Dankwa Boakye</h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6">Full-Stack Software Developer. | Crafting innovative digital solutions with code and creativity</p>
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <a href="mailto:russelboakye@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="https://img.icons8.com/material-outlined/48/000000/gmail-new.png" alt="Gmail" className="w-10 h-10 dark:invert" />
                </a>
                <a href="https://www.linkedin.com/in/russel-dankwa-boakye-904252255/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="https://img.icons8.com/material-outlined/48/000000/linkedin.png" alt="LinkedIn" className="w-10 h-10 dark:invert" />
                </a>
                <a href="tel:+233240608256" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="https://img.icons8.com/material-outlined/48/000000/phone.png" alt="Phone" className="w-10 h-10 dark:invert" />
                </a>
                <a href="https://github.com/blingyplus" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="https://img.icons8.com/material-outlined/48/000000/github.png" alt="GitHub" className="w-10 h-10 dark:invert" />
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
      </div>

      {/* Projects Section - Dynamic Content */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                  </CardContent>
                </Card>
              ))
            : projects.map((project) => (
                <div key={project.$id} className="transition-all duration-300 hover:-translate-y-1">
                  <Link href={`/projects/${project.$id}`}>
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <AppwriteImage src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground line-clamp-2">{stripHtmlTags(project.description)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>

      {/* Blog Posts Section - Dynamic Content */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : blogPosts.map((post) => (
                <div key={post.$id} className="transition-all duration-300 hover:-translate-y-1">
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
                      {post.imageUrl && <AppwriteImage src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />}
                      <CardHeader>
                        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">{post.title}</CardTitle>
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
                          <span className="text-sm text-muted-foreground">{formatDate(post.$createdAt)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
