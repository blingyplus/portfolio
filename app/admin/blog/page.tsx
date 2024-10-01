// app/admin/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blogPostsCollection } from "../../lib/appwrite";

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
}

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState<Omit<BlogPost, "$id">>({
    title: "",
    content: "",
    slug: "",
    publishDate: new Date().toISOString().split("T")[0],
    tags: [],
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const fetchedPosts = await blogPostsCollection.getAll();
    setPosts(fetchedPosts as unknown as BlogPost[]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setNewPost((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await blogPostsCollection.create(newPost);
    setNewPost({
      title: "",
      content: "",
      slug: "",
      publishDate: new Date().toISOString().split("T")[0],
      tags: [],
    });
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await blogPostsCollection.delete(id);
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Post Title" value={newPost.title} onChange={handleInputChange} required />
            <Textarea name="content" placeholder="Post Content" value={newPost.content} onChange={handleInputChange} required />
            <Input name="slug" placeholder="Slug" value={newPost.slug} onChange={handleInputChange} required />
            <Input type="date" name="publishDate" value={newPost.publishDate} onChange={handleInputChange} required />
            <Input name="tags" placeholder="Tags (comma-separated)" value={newPost.tags.join(", ")} onChange={handleTagsChange} />
            <Button type="submit">Add Blog Post</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.$id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content.substring(0, 100)}...</p>
              <p>Publish Date: {new Date(post.publishDate).toLocaleDateString()}</p>
              <p>Tags: {post.tags.join(", ")}</p>
              <Button variant="destructive" onClick={() => handleDelete(post.$id)} className="mt-4">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
