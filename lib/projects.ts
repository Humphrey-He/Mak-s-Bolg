import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const projectsDirectory = join(process.cwd(), "content", "projects");

export type ProjectSummary = {
  slug: string;
  name: string;
  type: string;
  desc: string;
  techStack: string[];
  highlights: string[];
  repoUrl?: string;
};

export type Project = ProjectSummary & {
  content: string;
};

type Frontmatter = {
  name: string;
  slug: string;
  type: string;
  desc: string;
  techStack: string[];
  highlights: string[];
  repoUrl?: string;
};

function getProjectFileNames() {
  return readdirSync(projectsDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort();
}

function readProjectFile(fileName: string): Project {
  const source = readFileSync(join(projectsDirectory, fileName), "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as Frontmatter;
  const fileSlug = fileName.replace(/\.mdx$/, "");
  const slug = frontmatter.slug || fileSlug;

  return {
    slug,
    name: frontmatter.name,
    type: frontmatter.type,
    desc: frontmatter.desc,
    techStack: frontmatter.techStack || [],
    highlights: frontmatter.highlights || [],
    repoUrl: frontmatter.repoUrl,
    content,
  };
}

function getAllProjectFiles(): Project[] {
  return getProjectFileNames().map((fileName) => readProjectFile(fileName));
}

export function getAllProjects(): ProjectSummary[] {
  return getAllProjectFiles()
    .map(({ content, ...project }) => project);
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}

export function getProjectBySlug(slug: string): Project | null {
  const project = getAllProjectFiles().find((item) => item.slug === slug);
  return project || null;
}
