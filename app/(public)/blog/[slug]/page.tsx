import { Metadata } from "next";
import { notFound } from "next/navigation";
import { stripHtmlTags } from "@/app/lib/utils";
import { getBlogPosts } from "@/app/lib/content";
import BlogPostContent from "./BlogPostContent";
import { siteConfig } from "@/app/config/site";

// Refresh content from Appwrite at most every 5 minutes (must be a literal for Next.js).
export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = await getBlogPosts();
  const post = posts?.find((p) => p.slug === params.slug);

  if (!post) {
    return posts
      ? { title: "Blog Post Not Found", description: "The requested blog post could not be found." }
      : {
          title: `Blog Post | ${siteConfig.personal.fullName}`,
          description: `Read blog posts by ${siteConfig.personal.fullName} about web development, programming, and technology.`,
        };
  }

  const description = stripHtmlTags(post.content).substring(0, 160);

  return {
    title: post.title,
    description,
    keywords: [...post.tags, siteConfig.personal.fullName, siteConfig.personal.nickname, "Blog", "Web Development"],
    authors: [{ name: siteConfig.personal.fullName }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: siteConfig.brand.siteName,
      publishedTime: post.publishDate,
      authors: [siteConfig.personal.fullName],
      tags: post.tags,
      ...(post.imageUrl ? { images: [{ url: post.imageUrl, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      creator: siteConfig.social.twitter,
      ...(post.imageUrl ? { images: [post.imageUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const posts = await getBlogPosts();

  // Server could not reach Appwrite: let the client fetch instead of failing the page.
  if (!posts) return <BlogPostContent slug={params.slug} />;

  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const relatedPosts = posts.filter((p) => p.slug !== params.slug).slice(0, 3);
  return <BlogPostContent slug={params.slug} initialPost={post} initialRelatedPosts={relatedPosts} />;
}
