// app/(public)/blog/BlogClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { blogPostsCollection } from "@/app/lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ErrorMessage from "@/app/components/error";
import AppwriteImage from "@/app/components/AppwriteImage";
import { formatDate, stripHtmlTags } from "@/app/lib/utils";
import { SkeletonLoader } from "@/app/components/skeleton-loader";
import type { BlogPost } from "@/app/lib/content";

export default function BlogClient({ initialPosts = null }: { initialPosts?: BlogPost[] | null }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts ?? []);
  const [loading, setLoading] = useState(initialPosts === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    // Server already supplied the posts; only fetch in the browser as a fallback.
    if (initialPosts !== null) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogPostsCollection.getAll();
        // Sort posts by creation date (newest first)
        const sortedPosts = (data as unknown as BlogPost[]).sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
        setPosts(sortedPosts);
        setError(null);
      } catch {
        setError("Failed to fetch blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [initialPosts]);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <SkeletonLoader count={6} type="blog" />
      </div>
    );
  }
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 sm:space-y-14">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.$id} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {post.imageUrl && <AppwriteImage src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />}
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                  <p className="line-clamp-3 text-muted-foreground mb-4">{stripHtmlTags(post.content)}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">Read More</span>
                  <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                    {formatDate(post.$createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
