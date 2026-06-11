import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { BlogContent } from "@/components/blog/BlogContent";
import { getAllPosts, getPostSeries, getPostTags } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getPostTags();
  const series = getPostSeries();

  return (
    <SiteShell>
      <Suspense fallback={<BlogLoadingSkeleton />}>
        <BlogContent posts={posts} tags={tags} series={series} />
      </Suspense>
    </SiteShell>
  );
}

function BlogLoadingSkeleton() {
  return (
    <section className="relative pb-24 pt-8">
      <div className="mx-auto mb-6 flex max-w-7xl flex-col justify-between gap-4 px-5 md:flex-row md:items-end">
        <div>
          <div className="h-12 w-64 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-6 w-96 animate-pulse rounded bg-white/5" />
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-5">
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </section>
  );
}
