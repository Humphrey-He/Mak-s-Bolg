"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { BlogPostSummary, BlogSeriesSummary } from "@/lib/posts";
import { copy } from "@/data/copy";
import { Icon } from "@/components/shared/Icon";

type BlogListProps = {
  posts: BlogPostSummary[];
  tags: string[];
  series: BlogSeriesSummary[];
};

function FilterBar({
  keyword,
  setKeyword,
  activeTag,
  setActiveTag,
  tags,
}: {
  keyword: string;
  setKeyword: (value: string) => void;
  activeTag: string;
  setActiveTag: (value: string) => void;
  tags: string[];
}) {
  const t = copy.zh;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-xl px-3 py-2 text-sm transition ${
                activeTag === tag ? "bg-cyan-300/15 text-cyan-100" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeriesDirectory({
  series,
  activeSeries,
  setActiveSeries,
}: {
  series: BlogSeriesSummary[];
  activeSeries: string;
  setActiveSeries: (value: string) => void;
}) {
  const total = series.reduce((sum, item) => sum + item.count, 0);
  const options = [{ slug: "All", name: "全部栏目", description: "查看所有技术文章", count: total, latestDate: "", accent: "cyan" }, ...series];

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl lg:sticky lg:top-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">SERIES</p>
          <h3 className="mt-1 text-lg font-black text-white">技术栏目</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 font-mono text-xs text-slate-400">{total}</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 lg:max-h-[calc(100vh-12rem)] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
        {options.map((item) => {
          const active = activeSeries === item.slug;

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setActiveSeries(item.slug)}
              className={`min-w-[230px] rounded-2xl border p-3 text-left transition lg:min-w-0 ${
                active
                  ? "border-cyan-200/45 bg-cyan-300/12 text-white shadow-[0_0_32px_rgba(34,211,238,.12)]"
                  : "border-white/10 bg-black/15 text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="line-clamp-1 text-sm font-bold">{item.name}</span>
                <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 font-mono text-[11px] text-slate-400">{item.count}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function TopPostCard({ post, index, active, onSelect }: { post: BlogPostSummary; index: number; active: boolean; onSelect: () => void }) {
  return (
    <motion.article
      onClick={onSelect}
      animate={{ opacity: active ? 1 : 0.55, scale: active ? 1.04 : 0.92, y: active ? -10 : 0 }}
      className={`article-card-gpu relative h-[360px] w-[78vw] max-w-[520px] shrink-0 overflow-hidden rounded-[2rem] border p-6 md:w-[460px] ${
        active ? "border-cyan-200/45 bg-white/[0.075] shadow-[0_0_58px_rgba(34,211,238,.18)]" : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <span className="inline-flex rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">TOP {index + 1}</span>
        <h3 className="mt-5 text-3xl font-black leading-tight text-white">{post.title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-400">{post.description}</p>
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500">
          <span>{post.series}</span>
          <span className="text-cyan-100">{post.readTime}</span>
        </div>
      </Link>
    </motion.article>
  );
}

function ArticleListItem({ post, index }: { post: BlogPostSummary; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.035 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-cyan-200/30 hover:bg-white/[0.065]"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{post.tag}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{post.series}</span>
          {post.top && <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">TOP</span>}
          <span className="font-mono text-xs text-slate-500">{post.date}</span>
        </div>
        <h3 className="text-lg font-black text-white group-hover:text-cyan-100">{post.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{post.description}</p>
      </Link>
    </motion.article>
  );
}

function PaginationControls({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) {
  const progress = totalPages <= 1 ? 100 : Math.round((page / totalPages) * 100);

  return (
    <div className="mt-7 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-[minmax(112px,auto)_minmax(0,1fr)_minmax(112px,auto)] md:items-center">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-200/30 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span aria-hidden="true">←</span>
          <span>上一页</span>
        </button>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">PAGE</p>
              <p className="mt-1 text-sm font-semibold text-white">
                第 <span className="font-mono text-cyan-100">{page}</span> / <span className="font-mono text-slate-300">{totalPages}</span> 页
              </p>
            </div>

            <label className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
              <span className="whitespace-nowrap">跳转</span>
              <select
                value={page}
                onChange={(event) => setPage(Number(event.target.value))}
                aria-label="选择页码"
                className="h-9 rounded-xl border border-white/10 bg-slate-950 px-3 font-mono text-sm text-cyan-100 outline-none transition focus:border-cyan-200/45"
              >
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <option key={pageNumber} value={pageNumber}>
                      {pageNumber}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-cyan-200/70 transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-200/30 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span>下一页</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export function BlogList({ posts, tags, series }: BlogListProps) {
  const t = copy.zh;
  const [keyword, setKeyword] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [activeSeries, setActiveSeries] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(1);
  const wheelLock = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const pageSize = 8;

  const topPosts = posts.filter((post) => post.top).slice(0, 5);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchTag = activeTag === "All" || post.tag === activeTag;
      const matchSeries = activeSeries === "All" || post.seriesSlug === activeSeries;
      const text = `${post.title} ${post.description} ${post.tag} ${post.series}`.toLowerCase();
      return matchTag && matchSeries && text.includes(keyword.trim().toLowerCase());
    });
  }, [activeSeries, activeTag, keyword, posts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const pagedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);

  const resetPage = () => setPage(1);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    if (wheelLock.current) return;

    wheelLock.current = true;
    setActiveIndex((prev) => Math.max(0, Math.min(prev + (event.deltaY > 0 ? 1 : -1), topPosts.length - 1)));
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 180);
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
          <h2 className="font-serif text-4xl font-black text-white md:text-5xl">{t.postsTitle}</h2>
          <p className="mt-2 text-sm text-slate-400">{t.postsSubtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-xs text-slate-400 backdrop-blur-xl">
          {posts.length} posts / {series.length} series
        </div>
      </div>

      {topPosts.length > 0 && (
        <div className="relative mx-auto mt-10 max-w-7xl px-5">
          <div
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="article-focus-stage relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/20 py-12 backdrop-blur-xl"
          >
            <motion.div
              className="article-track-gpu flex items-center gap-6 px-[calc(50%-39vw)] md:px-[calc(50%-230px)]"
              animate={{ x: -activeIndex * 544 }}
              transition={{ type: "spring", stiffness: 220, damping: 32, mass: 0.8 }}
            >
              {topPosts.map((post, index) => (
                <TopPostCard key={post.slug} post={post} index={index} active={index === activeIndex} onSelect={() => setActiveIndex(index)} />
              ))}
            </motion.div>
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SeriesDirectory
          series={series}
          activeSeries={activeSeries}
          setActiveSeries={(value) => {
            setActiveSeries(value);
            resetPage();
          }}
        />

        <div className="min-w-0">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="text-2xl font-black text-white md:text-3xl">全部文章</h3>
              <p className="mt-2 text-sm text-slate-400">按系列、标签和关键词组合筛选技术文章。</p>
            </div>
            <div className="font-mono text-xs text-slate-500">
              {filteredPosts.length} posts / page {page} of {totalPages}
            </div>
          </div>

          <FilterBar
            keyword={keyword}
            setKeyword={(value) => {
              setKeyword(value);
              resetPage();
            }}
            activeTag={activeTag}
            setActiveTag={(tag) => {
              setActiveTag(tag);
              resetPage();
            }}
            tags={tags}
          />

          <motion.div
            key={`article-page-${page}-${keyword}-${activeTag}-${activeSeries}`}
            initial={{ opacity: 0, x: 34, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="mt-8 grid grid-cols-1 gap-4"
          >
            {pagedPosts.map((post, index) => (
              <ArticleListItem key={post.slug} post={post} index={index} />
            ))}
          </motion.div>

          <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>
    </section>
  );
}
