import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "content", "posts");

export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  readTime: string;
  top: boolean;
  featured: boolean;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

type Frontmatter = {
  slug?: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  readTime: string;
  top?: boolean;
  featured?: boolean;
};

function getPostFileNames() {
  return readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort();
}

function readPostFile(fileName: string): BlogPost {
  const source = readFileSync(join(postsDirectory, fileName), "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as Frontmatter;
  const fileSlug = fileName.replace(/\.mdx$/, "");
  const slug = frontmatter.slug || fileSlug;

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    tag: frontmatter.tag,
    readTime: frontmatter.readTime,
    top: Boolean(frontmatter.top),
    featured: Boolean(frontmatter.featured),
    content,
  };
}

function byDateDesc(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function getAllPostFiles(): BlogPost[] {
  return getPostFileNames().map((fileName) => readPostFile(fileName));
}

export function getAllPosts(): BlogPostSummary[] {
  return getAllPostFiles()
    .sort(byDateDesc)
    .map(({ content, ...post }) => post);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const post = getAllPostFiles().find((item) => item.slug === slug);
  return post || null;
}

export function getRelatedPosts(currentPost: BlogPost, count: number = 3): BlogPostSummary[] {
  return getAllPosts()
    .filter((post) => post.slug !== currentPost.slug && post.tag === currentPost.tag)
    .slice(0, count);
}

export function getPostTags(): string[] {
  return ["All", ...Array.from(new Set(getAllPosts().map((post) => post.tag)))];
}
