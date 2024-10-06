// app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { blogPostsCollection } from "../lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "../components/loading";
import ErrorMessage from "../components/error";
import AppwriteImage from "../components/AppwriteImage";

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
  imageUrl?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogPostsCollection.getAll();
        setPosts(data as unknown as BlogPost[]);
        setError(null);
      } catch (err) {
        setError("Failed to fetch blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.$id} className="flex flex-col">
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
                <p className="mb-4 line-clamp-3">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button asChild variant="outline">
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
                <span className="text-sm text-muted-foreground">{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
