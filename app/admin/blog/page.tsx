// app/admin/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blogPostsCollection } from "../../lib/appwrite";

interface BlogPost {
  $id: string;
  $databaseId?: string;
  $collectionId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
}

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingPost) {
      setEditingPost((prev) => {
        if (prev === null) return null;
        return { ...prev, [name]: value };
      });
    } else {
      setNewPost((prev) => ({ ...prev, [name]: value }));
    }

    // Generate slug when title changes
    if (name === "title") {
      const slug = generateSlug(value);
      if (editingPost) {
        setEditingPost((prev) => {
          if (prev === null) return null;
          return { ...prev, slug };
        });
      } else {
        setNewPost((prev) => ({ ...prev, slug }));
      }
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/--+/g, "-") // Replace multiple - with single -
      .trim(); // Trim - from start and end of text
  };

  const handleEditorChange = (content: string) => {
    if (editingPost) {
      setEditingPost({ ...editingPost, content });
    } else {
      setNewPost((prev) => ({ ...prev, content }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    if (editingPost) {
      setEditingPost({ ...editingPost, tags });
    } else {
      setNewPost((prev) => ({ ...prev, tags }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const { $id, title, content, slug, publishDate, tags } = editingPost;
      const updateData = { title, content, slug, publishDate, tags };
      await blogPostsCollection.update($id, updateData);
      setEditingPost(null);
    } else {
      await blogPostsCollection.create(newPost);
      setNewPost({
        title: "",
        content: "",
        slug: "",
        publishDate: new Date().toISOString().split("T")[0],
        tags: [],
      });
    }
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await blogPostsCollection.delete(id);
    fetchPosts();
  };

  const handleEdit = (post: BlogPost) => {
    const formattedPost = {
      ...post,
      publishDate: new Date(post.publishDate).toISOString().split("T")[0],
    };
    setEditingPost(formattedPost);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
      <Card>
        <CardHeader>
          <CardTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Post Title" value={editingPost ? editingPost.title : newPost.title} onChange={handleInputChange} required />
            <Input name="slug" placeholder="Slug" value={editingPost ? editingPost.slug : newPost.slug} onChange={handleInputChange} required />
            <Editor
              apiKey="3gfikj0e15e3l5jsh9qyiq3gcpzr7pmnvh48nrammlonb6jl" // Your actual API key
              init={{
                height: 400,
                menubar: false,
                plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount"],
                toolbar: "undo redo | formatselect | " + "bold italic backcolor | alignleft aligncenter " + "alignright alignjustify | bullist numlist outdent indent | " + "removeformat | help",
              }}
              value={editingPost ? editingPost.content : newPost.content}
              onEditorChange={handleEditorChange}
            />
            <Input type="date" name="publishDate" value={editingPost ? editingPost.publishDate : newPost.publishDate} onChange={handleInputChange} required />
            <Input name="tags" placeholder="Tags (comma-separated)" value={editingPost ? editingPost.tags.join(", ") : newPost.tags.join(", ")} onChange={handleTagsChange} />
            <div className="flex space-x-2">
              <Button type="submit">{editingPost ? "Update" : "Add"} Blog Post</Button>
              {editingPost && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </div>
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
              <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + "..." }} />
              <p>Publish Date: {new Date(post.publishDate).toLocaleDateString()}</p>
              <p>Tags: {post.tags.join(", ")}</p>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleEdit(post)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(post.$id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
