import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { AgentFeatureCard } from "@/components/home/AgentFeatureCard";
import { PersonaLab } from "@/components/home/PersonaLab";
import { BlogList } from "@/components/blog/BlogList";
import { BackendSection } from "@/components/backend/BackendSection";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <AgentFeatureCard />
      <PersonaLab />
      <BlogList />
      <BackendSection />
    </SiteShell>
  );
}
