import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { StartHere } from "@/components/home/StartHere";
import { AgentFeatureCard } from "@/components/home/AgentFeatureCard";
import { PersonaLab } from "@/components/home/PersonaLab";
import { BlogList } from "@/components/blog/BlogList";
import { BackendSection } from "@/components/backend/BackendSection";
import { getAllPosts, getPostSeries, getPostTags } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getPostTags();
  const series = getPostSeries();

  return (
    <SiteShell>
      <Hero />
      <StartHere />
      <AgentFeatureCard />
      <PersonaLab />
      <Suspense fallback={null}>
        <BlogList posts={posts} tags={tags} series={series} />
      </Suspense>
      <BackendSection />
    </SiteShell>
  );
}
