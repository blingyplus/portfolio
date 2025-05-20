import { Metadata } from "next";
import { blogPostsCollection } from "@/app/lib/appwrite";
import { stripHtmlTags } from "@/app/lib/utils";

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  slug: string;
  publishDate: string;
  tags: string[];
}

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
        creator: "@blingyplus",
      },
    };
  } catch (error) {
    return {
      title: "Blog Post | Russel Boakye Dankwa",
      description: "Read blog posts by Russel Boakye Dankwa about web development, programming, and technology.",
    };
  }
}
