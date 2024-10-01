// app/blog/[slug]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { blogPostsCollection } from "../../lib/appwrite";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Loading from "../../components/loading";
import ErrorMessage from "../../components/error";

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
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
          // Get 3 random posts excluding the current one
          const otherPosts = allPosts.filter((p) => p.slug !== params.slug);
          const shuffled = otherPosts.sort(() => 0.5 - Math.random());
          setRelatedPosts(shuffled.slice(0, 3));
        } else {
          setError("Blog post not found.");
        }
      } catch (err) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
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
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-8">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((relatedPost) => (
          <Card key={relatedPost.$id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${relatedPost.slug}`} className="hover:underline">
                  {relatedPost.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{relatedPost.content.substring(0, 100)}...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
