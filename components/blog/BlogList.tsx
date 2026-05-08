"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { posts, tags } from "@/data/posts";
import { copy } from "@/data/copy";
import { localize } from "@/lib/i18n";
import { Icon } from "@/components/shared/Icon";

function FilterBar({
  keyword,
  setKeyword,
  activeTag,
  setActiveTag
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  activeTag: string;
  setActiveTag: (v: string) => void;
}) {
  const t = copy.zh;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t.searchPlaceholder} className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)} className={`rounded-xl px-3 py-2 text-sm transition ${activeTag === tag ? "bg-cyan-300/15 text-cyan-100" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopPostCard({ post, index, active, onSelect }: { post: typeof posts[number]; index: number; active: boolean; onSelect: () => void }) {
  return (
    <motion.article
      onClick={onSelect}
      animate={{ opacity: active ? 1 : 0.55, scale: active ? 1.06 : 0.9, y: active ? -10 : 0 }}
      className={`article-card-gpu relative h-[360px] w-[78vw] max-w-[520px] shrink-0 cursor-pointer overflow-hidden rounded-[2rem] border p-6 md:w-[460px] ${
        active ? "border-cyan-200/45 bg-white/[0.075] shadow-[0_0_58px_rgba(34,211,238,.18)]" : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <span className="inline-flex rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">TOP {index + 1}</span>
      <h3 className="mt-5 text-3xl font-black leading-tight text-white">{localize(post.title, "zh")}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-400">{localize(post.desc, "zh")}</p>
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500">
        <span>{post.date}</span>
        <span className="text-cyan-100">{post.read}</span>
      </div>
    </motion.article>
  );
}

function ArticleListItem({ post, index }: { post: typeof posts[number]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.035 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-cyan-200/30 hover:bg-white/[0.065]"
    >
      <a href={`/blog/${post.slug}`} className="block">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{post.tag}</span>
          {post.top && <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">TOP</span>}
          <span className="font-mono text-xs text-slate-500">{post.date}</span>
        </div>
        <h3 className="text-lg font-black text-white group-hover:text-cyan-100">{localize(post.title, "zh")}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{localize(post.desc, "zh")}</p>
      </a>
    </motion.article>
  );
}

export function BlogList() {
  const t = copy.zh;
  const [keyword, setKeyword] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(1);
  const wheelLock = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const pageSize = 5;

  const topPosts = posts.filter((post) => post.top).slice(0, 5);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchTag = activeTag === "All" || post.tag === activeTag;
      const text = `${localize(post.title, "zh")} ${localize(post.desc, "zh")} ${post.tag}`.toLowerCase();
      return matchTag && text.includes(keyword.trim().toLowerCase());
    });
  }, [keyword, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const pagedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);

  const getCarouselOffset = () => {
    const cardWidth = typeof window !== 'undefined' && window.innerWidth >= 768 ? 484 : 544;
    return -activeIndex * cardWidth;
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    if (wheelLock.current) return;
    wheelLock.current = true;
    setActiveIndex((prev) => Math.max(0, Math.min(prev + (event.deltaY > 0 ? 1 : -1), topPosts.length - 1)));
    window.setTimeout(() => { wheelLock.current = false; }, 180);
  };

  const stepCarousel = (direction: 1 | -1) => {
    setActiveIndex((prev) => Math.max(0, Math.min(prev + direction, topPosts.length - 1)));
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchStartX.current - touchEndX;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 48) return;
    stepCarousel(deltaX > 0 ? 1 : -1);
  };

  return (
    <section className="relative pb-24 pt-8">
      <div className="mx-auto mb-6 flex max-w-7xl flex-col justify-between gap-4 px-5 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">{t.postsTitle}</h2>
          <p className="mt-2 text-sm text-slate-400">{t.postsSubtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-xs text-slate-400 backdrop-blur-xl">
          Top 5 · {activeIndex + 1}/{topPosts.length}
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl px-5">
        <div
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="article-focus-stage relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/20 py-12 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex justify-between px-5">
            <button
              type="button"
              onClick={() => stepCarousel(-1)}
              disabled={activeIndex === 0}
              className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-slate-200 transition hover:border-cyan-200/50 hover:text-cyan-100 disabled:opacity-35"
              aria-label="上一张"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => stepCarousel(1)}
              disabled={activeIndex === topPosts.length - 1}
              className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-slate-200 transition hover:border-cyan-200/50 hover:text-cyan-100 disabled:opacity-35"
              aria-label="下一张"
            >
              →
            </button>
          </div>
          <motion.div
            className="article-track-gpu flex items-center gap-6 px-[calc(50%-39vw)] md:px-[calc(50%-230px)]"
            animate={{ x: getCarouselOffset() }}
            transition={{ type: "spring", stiffness: 220, damping: 32, mass: 0.8 }}
          >
            {topPosts.map((post, index) => (
              <TopPostCard key={post.id} post={post} index={index} active={index === activeIndex} onSelect={() => setActiveIndex(index)} />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-5">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h3 className="text-2xl font-black text-white md:text-3xl">全部文章</h3>
            <p className="mt-2 text-sm text-slate-400">检索全部文章，Top 5 只是后台精选展示。</p>
          </div>
          <div className="font-mono text-xs text-slate-500">{filteredPosts.length} 篇文章 · 第 {page}/{totalPages} 页</div>
        </div>
      </div>

      <FilterBar keyword={keyword} setKeyword={setKeyword} activeTag={activeTag} setActiveTag={(tag) => { setActiveTag(tag); setPage(1); }} />

      <div className="mx-auto mt-8 max-w-7xl px-5">
        <motion.div
          key={`article-page-${page}-${keyword}-${activeTag}`}
          initial={{ opacity: 0, x: 34, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.34, ease: "easeOut" }}
          className="grid grid-cols-1 gap-4"
        >
          {pagedPosts.map((post, index) => <ArticleListItem key={post.id} post={post} index={index} />)}
        </motion.div>

        <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl md:flex-row">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-slate-300 disabled:opacity-35">← 上一页</button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button key={pageNumber} onClick={() => setPage(pageNumber)} className={`grid h-9 w-9 place-items-center rounded-xl border text-sm font-bold transition ${page === pageNumber ? "border-cyan-200/45 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-black/20 text-slate-400"}`}>
                  {pageNumber}
                </button>
              );
            })}
          </div>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-slate-300 disabled:opacity-35">下一页 →</button>
        </div>
      </div>
    </section>
  );
}
