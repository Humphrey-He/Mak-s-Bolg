import { SiteShell } from "@/components/layout/SiteShell";
import { BlogList } from "@/components/blog/BlogList";
import { getAllPosts, getPostSeries, getPostTags } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getPostTags();
  const series = getPostSeries();

  return (
    <SiteShell>
      <BlogList posts={posts} tags={tags} series={series} />
    </SiteShell>
  );
}
