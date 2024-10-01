// app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { blogPostsCollection } from "../lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Loading from "../components/loading";
import ErrorMessage from "../components/error";

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
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
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.$id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content.substring(0, 150)}...</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
