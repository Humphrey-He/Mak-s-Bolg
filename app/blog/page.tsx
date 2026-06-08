import { SiteShell } from "@/components/layout/SiteShell";
import { BlogList } from "@/components/blog/BlogList";
import { normalizeBlogSeriesFilter } from "@/lib/contentFilters";
import { getAllPosts, getPostSeries, getPostTags } from "@/lib/posts";

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ series?: string | string[] }>;
}) {
  const posts = getAllPosts();
  const tags = getPostTags();
  const series = getPostSeries();
  const params = await searchParams;
  const initialSeries = normalizeBlogSeriesFilter(params?.series);

  return (
    <SiteShell>
      <BlogList posts={posts} tags={tags} series={series} initialSeries={initialSeries} />
    </SiteShell>
  );
}
