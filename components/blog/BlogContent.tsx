"use client";

import { useSearchParams } from "next/navigation";
import { BlogList } from "@/components/blog/BlogList";
import { normalizeBlogSeriesFilter } from "@/lib/contentFilters";
import type { BlogPostSummary, BlogSeriesSummary } from "@/lib/posts";

export function BlogContent({
  posts,
  tags,
  series,
}: {
  posts: BlogPostSummary[];
  tags: string[];
  series: BlogSeriesSummary[];
}) {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get("series") ?? undefined;
  const initialSeries = normalizeBlogSeriesFilter(seriesParam);

  return <BlogList posts={posts} tags={tags} series={series} initialSeries={initialSeries} />;
}
