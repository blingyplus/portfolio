// app/admin/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blogPostsCollection } from "../../lib/appwrite";
import { TINYMCE_API_KEY, TINYMCE_CONFIG } from "../../lib/tinymce";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { stripHtmlTags } from "../../lib/utils";

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

interface AppwriteError {
  message: string;
  code: number;
  type: string;
  version: string;
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await blogPostsCollection.getAll();
      setPosts(fetchedPosts as unknown as BlogPost[]);
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error fetching posts:", appwriteError);
      toast({
        title: "Error",
        description: appwriteError.message || "Failed to fetch blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    try {
      if (editingPost) {
        const { $id, title, content, slug, publishDate, tags } = editingPost;
        await blogPostsCollection.update($id, { title, content, slug, publishDate, tags });
        toast({ title: "Success", description: "Blog post updated." });
        setEditingPost(null);
      } else {
        await blogPostsCollection.create(newPost);
        toast({ title: "Success", description: "Blog post created." });
        setNewPost({ title: "", content: "", slug: "", publishDate: new Date().toISOString().split("T")[0], tags: [] });
      }
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error saving post:", appwriteError);
      toast({ title: "Error", description: appwriteError.message || "Failed to save blog post", variant: "destructive" });
    } finally {
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogPostsCollection.delete(id);
      toast({ title: "Success", description: "Blog post deleted." });
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error deleting post:", appwriteError);
      toast({ title: "Error", description: appwriteError.message || "Failed to delete blog post", variant: "destructive" });
    } finally {
      fetchPosts();
    }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
          View Site
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Post Title" value={editingPost ? editingPost.title : newPost.title} onChange={handleInputChange} required className="w-full" />
            <Input name="slug" placeholder="Slug" value={editingPost ? editingPost.slug : newPost.slug} onChange={handleInputChange} required className="w-full" />
            <div className="min-h-[300px]">
              <Editor apiKey={TINYMCE_API_KEY} init={TINYMCE_CONFIG} value={editingPost ? editingPost.content : newPost.content} onEditorChange={handleEditorChange} />
            </div>
            <div className="space-y-4">
              <Input type="date" name="publishDate" value={editingPost ? editingPost.publishDate : newPost.publishDate} onChange={handleInputChange} required className="w-full" />
              <Input name="tags" placeholder="Tags (comma-separated)" value={editingPost ? editingPost.tags.join(", ") : newPost.tags.join(", ")} onChange={handleTagsChange} className="w-full" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="w-full sm:w-auto">
                {editingPost ? "Update Post" : "Add Post"}
              </Button>
              {editingPost && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Existing Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card key={post.$id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{stripHtmlTags(post.content)}</p>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p>Published: {new Date(post.publishDate).toLocaleDateString()}</p>
                      <p>Tags: {post.tags.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => handleEdit(post)} className="w-full sm:w-auto">
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(post.$id)} className="w-full sm:w-auto">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
