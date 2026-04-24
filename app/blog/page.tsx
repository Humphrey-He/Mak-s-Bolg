import { SiteShell } from "@/components/layout/SiteShell";
import { BlogList } from "@/components/blog/BlogList";

export default function BlogPage() {
  return (
    <SiteShell>
      <BlogList />
    </SiteShell>
  );
}
