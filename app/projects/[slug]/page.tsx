import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjectBySlug, projectCards } from "@/data/projects";
import { localize } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectCards.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "项目未找到" };

  return {
    title: `${project.name} · 书鸦`,
    description: localize(project.desc, "zh"),
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <SiteShell>
      <ProjectDetail project={project} />
    </SiteShell>
  );
}
