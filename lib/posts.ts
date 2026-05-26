import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { blogSeriesBySlug, blogSeriesDefinitions } from "@/data/blogSeries";

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
  series: string;
  seriesSlug: string;
  seriesOrder: number;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

export type BlogSeriesSummary = {
  slug: string;
  name: string;
  description: string;
  accent: string;
  count: number;
  latestDate: string;
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
  series?: string;
  seriesSlug?: string;
  seriesOrder?: number;
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
  const seriesSlug = frontmatter.seriesSlug || "engineering-notes";
  const seriesDefinition = blogSeriesBySlug.get(seriesSlug);

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    tag: frontmatter.tag,
    readTime: frontmatter.readTime,
    top: Boolean(frontmatter.top),
    featured: Boolean(frontmatter.featured),
    series: frontmatter.series || seriesDefinition?.name || "工程实践随笔",
    seriesSlug,
    seriesOrder: Number(frontmatter.seriesOrder ?? 999),
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
    .sort((a, b) => byDateDesc(a, b) || a.seriesOrder - b.seriesOrder || a.title.localeCompare(b.title, "zh-Hans-CN"))
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
  const posts = getAllPosts().filter((post) => post.slug !== currentPost.slug);
  const sameSeries = posts.filter((post) => post.seriesSlug === currentPost.seriesSlug).sort((a, b) => a.seriesOrder - b.seriesOrder);

  if (sameSeries.length >= count) {
    return sameSeries.slice(0, count);
  }

  const sameTag = posts.filter((post) => post.seriesSlug !== currentPost.seriesSlug && post.tag === currentPost.tag);
  return [...sameSeries, ...sameTag].slice(0, count);
}

export function getPostTags(): string[] {
  return ["All", ...Array.from(new Set(getAllPosts().map((post) => post.tag)))];
}

export function getPostSeries(): BlogSeriesSummary[] {
  const posts = getAllPosts();

  return blogSeriesDefinitions
    .map((series) => {
      const seriesPosts = posts.filter((post) => post.seriesSlug === series.slug);
      const latestDate = seriesPosts.sort(byDateDesc)[0]?.date || "";

      return {
        ...series,
        count: seriesPosts.length,
        latestDate,
      };
    })
    .filter((series) => series.count > 0);
}
