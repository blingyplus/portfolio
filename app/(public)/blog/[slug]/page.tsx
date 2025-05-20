// app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { blogPostsCollection } from "@/app/lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Loading from "@/app/components/loading";
import ErrorMessage from "@/app/components/error";
import AppwriteImage from "@/app/components/AppwriteImage";
import { formatDate, stripHtmlTags } from "@/app/lib/utils";
import { Metadata } from "next";

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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const posts = await blogPostsCollection.getAll();
        const allPosts = posts as unknown as BlogPost[];
        const foundPost = allPosts.find((p) => p.slug === params.slug);
        if (foundPost) {
          setPost(foundPost);
          const otherPosts = allPosts.filter((p) => p.slug !== params.slug);
          const shuffled = otherPosts.sort(() => 0.5 - Math.random());
          setRelatedPosts(shuffled.slice(0, 3));
        } else {
          setError("Blog post not found.");
        }
      } catch {
        setError("Failed to fetch blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Blog post not found." />;

  const stripHtmlTags = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <article className="space-y-8">
        {post.imageUrl && <AppwriteImage src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-lg" />}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-muted-foreground">{formatDate(post.$createdAt)}</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <Card key={relatedPost.$id} className="hover:shadow-lg transition-shadow">
              <Link href={`/blog/${relatedPost.slug}`}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{relatedPost.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-muted-foreground">{stripHtmlTags(relatedPost.content.substring(0, 100))}...</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const posts = await blogPostsCollection.getAll();
    const post = (posts as unknown as BlogPost[]).find((p) => p.slug === params.slug);

    if (!post) {
      return {
        title: "Blog Post Not Found | Russel Boakye Dankwa",
        description: "The requested blog post could not be found.",
      };
    }

    const strippedContent = stripHtmlTags(post.content).substring(0, 160);

    return {
      title: `${post.title} | Russel Boakye Dankwa's Blog`,
      description: strippedContent,
      keywords: [...post.tags, "Russel Boakye Dankwa", "Russel Bling", "Blog", "Web Development"],
      authors: [{ name: "Russel Boakye Dankwa" }],
      openGraph: {
        title: post.title,
        description: strippedContent,
        type: "article",
        publishedTime: post.publishDate,
        authors: ["Russel Boakye Dankwa"],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: strippedContent,
        creator: "@your_twitter_handle",
      },
    };
  } catch (error) {
    return {
      title: "Blog Post | Russel Boakye Dankwa",
      description: "Read blog posts by Russel Boakye Dankwa about web development, programming, and technology.",
    };
  }
}
