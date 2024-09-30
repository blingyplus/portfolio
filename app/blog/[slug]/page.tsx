// app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { blogPostsCollection } from '../../lib/appwrite';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

  useEffect(() => {
    const fetchPost = async () => {
      const posts = await blogPostsCollection.getAll();
      const foundPost = (posts as unknown as BlogPost[]).find(p => p.slug === params.slug);
      setPost(foundPost || null);
    };
    fetchPost();
  }, [params.slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(post.publishDate).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </CardContent>
    </Card>
  );
}