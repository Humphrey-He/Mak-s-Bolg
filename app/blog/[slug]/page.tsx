import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Icon } from "@/components/shared/Icon";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: `${post.title} · 书鸦`,
    description: post.description,
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
      <ArticleReadingProgress />

      <div className="mx-auto max-w-5xl px-5 py-10">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl md:p-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-200">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            返回文章列表
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">{post.tag}</span>
            {post.top && <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100">精选</span>}
          </div>

          <h1 className="mt-6 font-serif text-4xl font-black tracking-tight text-white md:text-6xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-400">{post.description}</p>

          <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
            <span>{post.date}</span>
            <span className="text-cyan-200/60">{post.readTime}</span>
          </div>

          <div className="mt-10 prose prose-invert prose-cyan max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-white">相关文章</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-200/30 hover:bg-black/30">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{item.tag}</span>
                  <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}
