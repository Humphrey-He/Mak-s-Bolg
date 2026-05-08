"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { localize } from "@/lib/i18n";
import { Icon } from "@/components/shared/Icon";
import type { Post } from "@/data/posts";

interface ArticleDetailProps {
  post: Post;
  relatedPosts: Post[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function parseToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const toc: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w一-龥]+/g, "-");
      toc.push({ id, text, level });
    }
  }
  return toc;
}

function renderContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${t.toLowerCase().replace(/[^\w一-龥]+/g, "-")}">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${t.toLowerCase().replace(/[^\w一-龥]+/g, "-")}">${t}</h2>`)
    .replace(/^# (.+)$/gm, (_, t) => `<h1 id="${t.toLowerCase().replace(/[^\w一-龥]+/g, "-")}">${t}</h1>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith("<h")) return line;
      return `<p>${line}</p>`;
    });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/40">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

function PostToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-cyan-200/70">目录</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className={`block text-sm transition-colors ${
                activeId === item.id
                  ? "text-cyan-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <h3 className="mb-6 text-xl font-bold text-white">相关文章</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-200/30 hover:bg-white/[0.06]"
          >
            <span className="mb-2 inline-block rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-xs text-cyan-100">
              {post.tag}
            </span>
            <h4 className="mt-2 font-bold text-white group-hover:text-cyan-200">
              {localize(post.title, "zh")}
            </h4>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {localize(post.desc, "zh")}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function ArticleDetail({ post, relatedPosts }: ArticleDetailProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const lang = "zh";

  useEffect(() => {
    setToc(parseToc(post.content.zh));
  }, [post.content.zh]);

  const renderedContent = renderContent(post.content.zh);

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_220px]">
          <article>
            <header className="mb-8">
              <a
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-200"
              >
                <Icon name="arrow" className="h-4 w-4" />
                返回文章列表
              </a>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                  {post.tag}
                </span>
                {post.top && (
                  <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100">
                    精选
                  </span>
                )}
              </div>

              <h1 className="mt-6 font-serif text-4xl font-black tracking-tight text-white md:text-5xl">
                {localize(post.title, lang)}
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                {localize(post.desc, lang)}
              </p>

              <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                <span>{post.date}</span>
                <span className="text-cyan-200/60">{post.read}</span>
              </div>
            </header>

            <div
              ref={contentRef}
              className="prose prose-invert prose-cyan max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            <RelatedPosts posts={relatedPosts} />
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <PostToc items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
