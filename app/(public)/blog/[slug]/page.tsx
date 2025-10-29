import { Metadata } from "next";
import { blogPostsCollection } from "@/app/lib/appwrite";
import { stripHtmlTags } from "@/app/lib/utils";
import BlogPostContent from "./BlogPostContent";
import { siteConfig } from "@/app/config/site";

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
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const strippedContent = stripHtmlTags(post.content).substring(0, 160);

    return {
      title: post.title,
      description: strippedContent,
      keywords: [...post.tags, siteConfig.personal.fullName, siteConfig.personal.nickname, "Blog", "Web Development"],
      authors: [{ name: siteConfig.personal.fullName }],
      openGraph: {
        title: post.title,
        description: strippedContent,
        type: "article",
        publishedTime: post.publishDate,
        authors: [siteConfig.personal.fullName],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: strippedContent,
        creator: siteConfig.social.twitter,
      },
    };
  } catch (error) {
    return {
      title: `Blog Post | ${siteConfig.personal.fullName}`,
      description: `Read blog posts by ${siteConfig.personal.fullName} about web development, programming, and technology.`,
    };
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostContent slug={params.slug} />;
}
