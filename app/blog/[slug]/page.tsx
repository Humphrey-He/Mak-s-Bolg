import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticleDetail } from "@/components/blog/ArticleDetail";
import { getPostBySlug, getRelatedPosts, posts } from "@/data/posts";
import { localize } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };

  return {
    title: `${localize(post.title, "zh")} · 书鸦`,
    description: localize(post.desc, "zh"),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <SiteShell>
      <ArticleDetail post={post} relatedPosts={relatedPosts} />
    </SiteShell>
  );
}
