import { SiteShell } from "@/components/layout/SiteShell";
import { BlogList } from "@/components/blog/BlogList";
import { getAllPosts, getPostTags } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getPostTags();

  return (
    <SiteShell>
      <BlogList posts={posts} tags={tags} />
    </SiteShell>
  );
}
