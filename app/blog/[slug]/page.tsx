import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import * as runtime from "react/jsx-runtime";
import { SiteShell } from "@/components/layout/SiteShell";
import { Icon } from "@/components/shared/Icon";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import mdxComponents from "@/components/blog/mdx-components";
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
    title: `${post.title} | 书鸦`,
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
  const evaluated = await evaluate(post.content, {
    ...runtime,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
  });
  const Content = evaluated.default;

  return (
    <SiteShell>
      <ArticleReadingProgress />

      <div className="mx-auto max-w-6xl px-5 py-10">
        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-6 py-8 md:px-10 md:py-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-200">
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              返回文章列表
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">{post.tag}</span>
              {post.top && (
                <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100">
                  精选
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl font-serif text-4xl font-black tracking-tight text-white md:text-6xl">{post.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{post.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">{post.date}</span>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">{post.readTime}</span>
            </div>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">文章定位</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">生产环境里的实战经验沉淀，适合拿来做方案评审、复盘和升级前检查。</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">阅读建议</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">先看标题和列表，再回到关键段落。技术文章更适合“跳读 + 回查”的结构。</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">适合场景</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">云原生、后端工程、系统设计、性能优化、故障处理和团队知识沉淀。</p>
              </div>
            </div>

            <div className="article-prose">
              <Content components={mdxComponents} />
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-white">相关文章</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-200/30 hover:bg-black/30"
                >
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
