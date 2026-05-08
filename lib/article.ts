export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractArticleHeadings(content: string): ArticleHeading[] {
  const lines = content.split(/\r?\n/);
  const headings: ArticleHeading[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({
      id: slugifyHeading(text),
      text,
      level,
    });
  }

  return headings;
}
